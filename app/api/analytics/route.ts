import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCachedData, cacheKeys, CACHE_TTL } from "@/lib/redis"
import { getCurrentUser } from "@/lib/jwt"

export async function GET(request: Request) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const userId = currentUser.userId
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30", 10)

    const cacheKey = `${cacheKeys.stats(userId)}:${days}`

    // Use the caching utility to get analytics data
    const analyticsData = await getCachedData(
      cacheKey,
      async () => {
        // This function will only be called on cache miss

        // Date range for the query
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        const startDateStr = startDate.toISOString()

        // Total views
        const viewsResult = await executeQuery(
          `
          SELECT COUNT(*) as count
          FROM "ProfileView"
          WHERE "userId" = $1 AND "createdAt" >= $2
        `,
          [userId, startDateStr],
        )
        const totalViews = Number.parseInt(viewsResult[0].count, 10)

        // Total clicks
        const clicksResult = await executeQuery(
          `
          SELECT SUM(clicks) as count
          FROM "Link"
          WHERE "userId" = $1
        `,
          [userId],
        )
        const totalClicks = Number.parseInt(clicksResult[0].count || "0", 10)

        // Active links
        const linksResult = await executeQuery(
          `
          SELECT COUNT(*) as count
          FROM "Link"
          WHERE "userId" = $1 AND active = true
        `,
          [userId],
        )
        const activeLinks = Number.parseInt(linksResult[0].count, 10)

        // Views by day
        const viewsByDay = await executeQuery(
          `
          SELECT 
            DATE("createdAt") as date,
            COUNT(*) as count
          FROM "ProfileView"
          WHERE "userId" = $1 AND "createdAt" >= $2
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `,
          [userId, startDateStr],
        )

        // Clicks by day (approximation from LinkClick table)
        const clicksByDay = await executeQuery(
          `
          SELECT 
            DATE(lc."createdAt") as date,
            COUNT(*) as count
          FROM "LinkClick" lc
          JOIN "Link" l ON lc."linkId" = l.id
          WHERE l."userId" = $1 AND lc."createdAt" >= $2
          GROUP BY DATE(lc."createdAt")
          ORDER BY date ASC
        `,
          [userId, startDateStr],
        )

        // Top links
        const topLinks = await executeQuery(
          `
          SELECT id, title, url, clicks
          FROM "Link"
          WHERE "userId" = $1
          ORDER BY clicks DESC
          LIMIT 5
        `,
          [userId],
        )

        return {
          totalViews,
          totalClicks,
          activeLinks,
          ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0",
          viewsByDay,
          clicksByDay,
          topLinks,
        }
      },
      CACHE_TTL.STATS,
    )

    return NextResponse.json({
      success: true,
      data: analyticsData,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch analytics" }, { status: 500 })
  }
}
