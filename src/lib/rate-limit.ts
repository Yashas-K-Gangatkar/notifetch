interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limiters = new Map<string, Map<string, RateLimitEntry>>();

/**
 * Basic in-memory rate limiter.
 * @param type The type of rate limit (e.g., 'notification-single', 'notification-batch')
 * @param key The unique key for the user/client (e.g., userId or IP)
 * @param limit Max requests allowed in the window
 * @param window Window size in milliseconds
 * @returns boolean true if allowed, false if rate limited
 */
export function rateLimit(type: string, key: string, limit: number, window: number): boolean {
  const now = Date.now();

  if (!limiters.has(type)) {
    limiters.set(type, new Map());
  }

  const typeLimiter = limiters.get(type)!;
  const entry = typeLimiter.get(key);

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
