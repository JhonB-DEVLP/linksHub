import { executeQuery } from "@/server/utils/db"
import { redis, cacheKeys, CACHE_TTL } from "./redis"

/**
 * Warm up cache for frequently accessed profiles
 */
export async function warmupPopularProfiles(limit = 10): Promise<void> {
  try {
    console.log(`Starting cache warmup for top ${limit} profiles...`)

    // Get the most viewed profiles
    const popularProfiles = await executeQuery(
      `
      SELECT 
        u.username,
        COUNT(pv.id) as view_count
      FROM "User" u
      JOIN "ProfileView" pv ON u.id = pv."userId"
      WHERE pv."createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY u.username
      ORDER BY view_count DESC
      LIMIT $1
    `,
      [limit],
    )

    // Warm up cache for each profile
    for (const profile of popularProfiles) {
      const username = profile.username

      // Fetch user profile
      const userProfiles = await executeQuery(
        `
        SELECT u.id, u.name, u.username, p.*
        FROM "User" u
        JOIN "Profile" p ON u.id = p.userId
        WHERE u.username = $1
      `,
        [username],
      )

      if (userProfiles.length === 0) continue

      const userProfile = userProfiles[0]

      // Fetch user links
      const links = await executeQuery(
        `
        SELECT * FROM "Link"
        WHERE userId = $1 AND active = true
        ORDER BY position ASC
      `,
        [userProfile.id],
      )

      // Store in cache
      const cacheKey = cacheKeys.profile(username)
      await redis.set(cacheKey, { profile: userProfile, links }, { ex: CACHE_TTL.PROFILE })

      console.log(`Cached profile for ${username} with ${links.length} links`)
    }

    console.log(`Cache warmup completed for ${popularProfiles.length} profiles`)
  } catch (error) {
    console.error("Error during cache warmup:", error)
  }
}

/**
 * Schedule regular cache warmup
 */
export function scheduleWarmup(intervalMinutes = 60): NodeJS.Timeout {
  console.log(`Scheduling cache warmup every ${intervalMinutes} minutes`)

  // Run immediately
  warmupPopularProfiles()

  // Schedule regular runs
  return setInterval(
    () => {
      warmupPopularProfiles()
    },
    intervalMinutes * 60 * 1000,
  )
}
