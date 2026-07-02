import axios from 'axios'
import { resolveActor } from './resolve-actor.js'

const pickAvatar = (entity, host) => {
  const avatars =
    Array.isArray(entity?.avatars) && entity.avatars.length > 0
      ? entity.avatars
      : entity?.avatar
        ? [entity.avatar]
        : []
  if (avatars.length === 0) return null
  const sorted = [...avatars].sort((a, b) => (a.width || 0) - (b.width || 0))
  const chosen = sorted.find((a) => (a.width || 0) >= 120) || sorted[sorted.length - 1]
  const path = chosen?.fileUrl || chosen?.path
  if (!path) return null
  return path.startsWith('http') ? path : `https://${host}${path}`
}

export const fetchPeerTubeChannel = async (handle, { throttle } = {}) => {
  const actor = await resolveActor(handle, { throttle })
  if (!actor) {
    console.error(`Invalid PeerTube handle: ${handle}`)
    return null
  }
  const { type, host, name } = actor
  const base = `https://${host}/api/v1/${type}/${encodeURIComponent(name)}`

  try {
    if (throttle) await throttle(host)
    const { data: entity } = await axios.get(base, { timeout: 20_000 })

    // Video count comes from a separate endpoint (total of an empty page).
    let videosCount = null
    try {
      if (throttle) await throttle(host)
      const { data: videos } = await axios.get(`${base}/videos`, {
        params: { count: 0, start: 0 },
        timeout: 12_000
      })
      videosCount = Number.isFinite(videos?.total) ? videos.total : null
    } catch (error) {
      console.error(`Error fetching videos for ${handle}:`, error.message)
    }

    const resolvedHost = entity?.host ?? host
    return {
      kind: type === 'video-channels' ? 'channel' : 'account',
      name: entity?.name ?? name,
      displayName: entity?.displayName ?? null,
      host: resolvedHost,
      url: entity?.url ?? `https://${resolvedHost}/${type}/${name}`,
      followersCount: Number.isFinite(entity?.followersCount) ? entity.followersCount : null,
      videosCount,
      createdAt: entity?.createdAt ?? null,
      avatar: pickAvatar(entity, resolvedHost)
    }
  } catch (error) {
    console.error(`Error looking up PeerTube channel ${handle}:`, error.message)
    return null
  }
}

/**
 * Enrich a Wikidata result that carries a PeerTube channel address (P12622).
 * Returns null when the actor cannot be resolved, so the orchestrator can drop it.
 */
export const enrichPeerTubeChannel = async (result, { throttle } = {}) => {
  const channelLookup = await fetchPeerTubeChannel(result.peertube?.value, { throttle })
  if (!channelLookup) return null
  return { ...result, channelLookup }
}

// Quick manual test: `node src/platforms/peertube/enrich-channel.js name@host`
if (import.meta.url === `file://${process.argv[1]}`) {
  const handle = process.argv[2]
  if (!handle) {
    console.error('Usage: node src/platforms/peertube/enrich-channel.js <name@host>')
    process.exit(1)
  }
  fetchPeerTubeChannel(handle)
    .then((channel) => console.log(JSON.stringify(channel, null, 2)))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
