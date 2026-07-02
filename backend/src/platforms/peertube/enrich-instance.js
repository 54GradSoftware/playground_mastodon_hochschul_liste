import axios from 'axios'

// Instance logos come as several sizes (config.instance.avatars / .icons), paths relative
// to the instance. Prefer a mid-size one, fall back to the largest.
const pickAvatar = (config, base) => {
  const icons = config?.instance?.avatars || config?.instance?.icons || []
  if (!Array.isArray(icons) || icons.length === 0) return null
  const sorted = [...icons].sort((a, b) => (a.width || 0) - (b.width || 0))
  const chosen = sorted.find((a) => (a.width || 0) >= 120) || sorted[sorted.length - 1]
  const path = chosen?.fileUrl || chosen?.path || chosen?.url
  if (!path) return null
  return path.startsWith('http') ? path : `${base}${path}`
}

const num = (n) => (Number.isFinite(n) ? n : null)

/**
 * Look up a PeerTube instance by its base URL (Wikidata P14256). Reads /api/v1/config for
 * name + version and /api/v1/server/stats for usage numbers. 
 */
export const fetchPeerTubeInstance = async (url, { throttle } = {}) => {
  let host
  try {
    host = new URL(url).host
  } catch {
    console.error(`Invalid PeerTube instance URL: ${url}`)
    return null
  }
  const base = url.replace(/\/+$/, '')

  try {
    if (throttle) await throttle(host)
    const { data: config } = await axios.get(`${base}/api/v1/config`, { timeout: 12_000 })

    let stats = {}
    try {
      if (throttle) await throttle(host)
      const { data } = await axios.get(`${base}/api/v1/server/stats`, { timeout: 12_000 })
      stats = data || {}
    } catch (error) {
      console.error(`Error fetching stats for ${url}:`, error.message)
    }

    return {
      name: config?.instance?.name ?? host,
      shortDescription: config?.instance?.shortDescription ?? null,
      version: config?.serverVersion ?? null,
      url: `${base}/`,
      host,
      totalUsers: num(stats.totalUsers),
      totalLocalVideos: num(stats.totalLocalVideos),
      totalVideos: num(stats.totalVideos),
      totalChannels: num(stats.totalLocalVideoChannels),
      avatar: pickAvatar(config, base)
    }
  } catch (error) {
    console.error(`Error looking up PeerTube instance ${url}:`, error.message)
    return null
  }
}

export const enrichPeerTubeInstance = async (result, { throttle } = {}) => {
  const instanceLookup = await fetchPeerTubeInstance(result.peertube?.value, { throttle })
  if (!instanceLookup) return null
  return { ...result, instanceLookup }
}

// Quick manual test: `node src/platforms/peertube/enrich-instance.js https://grypstube.uni-greifswald.de`
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2]
  if (!url) {
    console.error('Usage: node src/platforms/peertube/enrich-instance.js <instance-url>')
    process.exit(1)
  }
  fetchPeerTubeInstance(url)
    .then((instance) => console.log(JSON.stringify(instance, null, 2)))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
