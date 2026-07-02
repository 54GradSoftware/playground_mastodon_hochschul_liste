import axios from 'axios'
import { resolveHandle } from './resolve-handle.js'

// A PeerTube address (P12622) can point at either a video channel (/video-channels/<name>)
// or an account (/accounts/<name>).
const parseActorUrl = (href) => {
  try {
    const url = new URL(href)
    const match = url.pathname.match(/\/(video-channels|accounts)\/([^/]+)\/?$/)
    if (!match) return null
    return {
      type: match[1], // 'video-channels' | 'accounts'
      host: url.host,
      name: decodeURIComponent(match[2])
    }
  } catch {
    return null
  }
}

export const resolveActor = async (handle, { throttle } = {}) => {
  const parsed = resolveHandle(handle)
  if (!parsed) return null
  const { name, host } = parsed

  try {
    if (throttle) await throttle(host)
    const { data } = await axios.get(`https://${host}/.well-known/webfinger`, {
      params: { resource: `acct:${name}@${host}` },
      timeout: 12_000
    })
    const links = Array.isArray(data?.links) ? data.links : []
    const self =
      links.find((l) => l.rel === 'self' && l.type === 'application/activity+json') ||
      links.find((l) => l.rel === 'self')
    const actor = self?.href ? parseActorUrl(self.href) : null
    if (actor) return actor
  } catch (error) {
    console.error(`WebFinger failed for ${handle}:`, error.message)
  }

  // Fallback: best-effort assume a local channel.
  return { type: 'video-channels', host, name }
}
