import { Redis } from "@upstash/redis"

// Initialize Redis client with environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PROFILE: 60 * 60, // 1 hour
  LINKS: 60 * 5, // 5 minutes
  STATS: 60 * 15, // 15 minutes
  USER: 60 * 30, // 30 minutes
}

// Cache key generators
export const cacheKeys = {
  profile: (username: string) => `profile:${username}`,
  links: (userId: string) => `links:${userId}`,
  link: (linkId: string) => `link:${linkId}`,
  stats: (userId: string) => `stats:${userId}`,
  linkStats: (linkId: string) => `linkStats:${linkId}`,
  user: (userId: string) => `user:${userId}`,
}

/**
 * Get data from cache or fetch from original source
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.PROFILE,
): Promise<T> {
  try {
    // Try to get from cache
    const cachedData = await redis.get<T>(key)

    if (cachedData) {
      console.log(`Cache hit for key: ${key}`)
      return cachedData
    }

    // If not in cache, fetch data
    console.log(`Cache miss for key: ${key}`)
    const data = await fetchFn()

    // Store in cache
    await redis.set(key, data, { ex: ttl })

    return data
  } catch (error) {
    console.error(`Redis error for key ${key}:`, error)
    // If Redis fails, execute the original function
    return fetchFn()
  }
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
    console.log(`Cache invalidated for key: ${key}`)
  } catch (error) {
    console.error(`Error invalidating cache for key ${key}:`, error)
  }
}

/**
 * Invalidate multiple cache keys matching a pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`Invalidated ${keys.length} keys matching pattern: ${pattern}`)
    }
  } catch (error) {
    console.error(`Error invalidating cache pattern ${pattern}:`, error)
  }
}

/**
 * Implement rate limiting using Redis
 * @param identifier - Unique identifier (e.g., IP address or user ID)
 * @param limit - Maximum number of requests
 * @param window - Time window in seconds
 * @returns Object containing limit information and whether the request is allowed
 */
export async function rateLimit(
  identifier: string,
  limit = 100,
  window = 60,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - window

  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart)

    // Count existing entries
    const count = await redis.zcard(key)

    // Check if limit is reached
    if (count >= limit) {
      // Get reset time
      const oldestTimestamp = await redis.zrange(key, 0, 0, { withScores: true })
      const resetTime =
        oldestTimestamp.length > 0 ? Math.floor(Number.parseInt(oldestTimestamp[0].score) + window - now) : window

      return {
        success: false,
        remaining: 0,
        reset: resetTime,
      }
    }

    // Add current request
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
    // Set expiry on the key
    await redis.expire(key, window * 2)

    return {
      success: true,
      remaining: limit - count - 1,
      reset: window,
    }
  } catch (error) {
    console.error(`Rate limiting error for ${identifier}:`, error)
    // If Redis fails, allow the request
    return {
      success: true,
      remaining: 0,
      reset: window,
    }
  }
}
