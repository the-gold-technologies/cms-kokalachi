/**
 * In-memory client cache with TTL support to minimize redundant requests
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_TTL = 60 * 1000; // 1 minute

export async function fetchWithCache<T = any>(
  url: string,
  options?: RequestInit,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  const method = options?.method || "GET";

  // Only cache GET requests
  if (method !== "GET") {
    const res = await fetch(url, options);
    const data = await res.json();
    // Invalidate cache on mutations
    cache.clear();
    return data;
  }

  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const res = await fetch(url, options);
  const data = await res.json();

  if (res.ok) {
    cache.set(url, { data, timestamp: Date.now() });
  }

  return data;
}

export function invalidateCache(urlPrefix?: string) {
  if (!urlPrefix) {
    cache.clear();
  } else {
    for (const key of cache.keys()) {
      if (key.startsWith(urlPrefix)) {
        cache.delete(key);
      }
    }
  }
}
