export const resolveHandle = (handle) => {
  if (!handle || typeof handle !== 'string') return null
  const trimmed = handle.trim().replace(/^@/, '')
  const at = trimmed.lastIndexOf('@')
  if (at <= 0 || at === trimmed.length - 1) return null
  return {
    name: trimmed.slice(0, at),
    host: trimmed.slice(at + 1).toLowerCase()
  }
}
