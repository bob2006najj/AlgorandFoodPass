export function env(key: string, fallback?: string) {
  const v = import.meta.env[key]
  if (v === undefined || v === null || String(v).trim() === '') {
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required env var: ${key}`)
  }
  return String(v)
}
