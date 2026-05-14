const cache = new Map()

export function getCached(key) {
  return cache.get(key)
}

export function setCached(key, value) {
  cache.set(key, value)
  return value
}

export function deleteCached(key) {
  cache.delete(key)
}

export function deleteCachedByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key)
    }
  }
}

export function clearCache() {
  cache.clear()
}
