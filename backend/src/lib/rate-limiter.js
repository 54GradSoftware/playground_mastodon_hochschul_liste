import { sleep } from './sleep.js'

export const createHostThrottle = ({ minDelayMs = 1_000, jitterMs = 250 } = {}) => {
  const lastRequest = new Map()
  return async (host) => {
    const last = lastRequest.get(host) || 0
    const elapsed = Date.now() - last
    const jitter = Math.floor(Math.random() * jitterMs)
    const wait = Math.max(0, minDelayMs - elapsed) + jitter
    if (wait > 0) await sleep(wait)
    lastRequest.set(host, Date.now())
  }
}
