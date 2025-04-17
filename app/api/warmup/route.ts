import { NextResponse } from "next/server"
import { warmupPopularProfiles } from "@/lib/cache-warmup"

// This endpoint can be called by a cron job to warm up the cache
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    // Check for secret key to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    const secretKey = process.env.CACHE_WARMUP_SECRET

    if (!secretKey || authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await warmupPopularProfiles(limit)

    return NextResponse.json({
      success: true,
      message: `Cache warmup completed for top ${limit} profiles`,
    })
  } catch (error) {
    console.error("Error during cache warmup:", error)
    return NextResponse.json({ success: false, message: "Failed to warm up cache" }, { status: 500 })
  }
}
