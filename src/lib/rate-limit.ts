interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limiters = new Map<string, Map<string, RateLimitEntry>>();

/**
 * Basic in-memory rate limiter with expiration cleanup.
 */
export function rateLimit(type: string, key: string, limit: number, window: number): boolean {
  const now = Date.now();

  if (!limiters.has(type)) {
    limiters.set(type, new Map());
  }

  const typeLimiter = limiters.get(type)!;
  const entry = typeLimiter.get(key);

  // Cleanup expired entries periodically (approx 1 in 50 calls)
  if (Math.random() < 0.02) {
    for (const [k, e] of typeLimiter.entries()) {
      if (now > e.resetAt) typeLimiter.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    typeLimiter.set(key, { count: 1, resetAt: now + window });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
