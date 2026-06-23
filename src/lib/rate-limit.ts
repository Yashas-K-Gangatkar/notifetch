const limiters = new Map<string, Map<string, { count: number; resetAt: number }>>();

/**
 * Basic in-memory rate limiter.
 * @param type The category of rate limiting (e.g. 'notifications.single')
 * @param key The unique key to limit (e.g. userId)
 * @param max Max requests allowed in the window
 * @param window Window size in milliseconds
 */
export function checkRateLimit(
  type: string,
  key: string,
  max: number,
  window: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  if (!limiters.has(type)) {
    limiters.set(type, new Map());
  }

  const typeMap = limiters.get(type)!;
  const entry = typeMap.get(key);

  if (!entry || now > entry.resetAt) {
    const newEntry = { count: 1, resetAt: now + window };
    typeMap.set(key, newEntry);
    return { allowed: true, remaining: max - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}
