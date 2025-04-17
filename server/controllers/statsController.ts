import type { Response } from "express"
import { neon } from "@neondatabase/serverless"
import type { AuthenticatedRequest } from "../middleware/authMiddleware"

const sql = neon(process.env.DATABASE_URL!)

// Obter estatísticas gerais do usuário
export const getUserStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id

    // Total de links
    const totalLinks = await sql`
      SELECT COUNT(*) as count FROM "Link"
      WHERE "userId" = ${userId}
    `

    // Total de cliques em todos os links
    const totalClicks = await sql`
      SELECT COALESCE(SUM(clicks), 0) as count FROM "Link"
      WHERE "userId" = ${userId}
    `

    // Total de visualizações do perfil
    const profileViews = await sql`
      SELECT COUNT(*) as count FROM "ProfileView"
      WHERE "userId" = ${userId}
    `

    // Links mais clicados (top 5)
    const topLinks = await sql`
      SELECT id, title, url, clicks FROM "Link"
      WHERE "userId" = ${userId}
      ORDER BY clicks DESC
      LIMIT 5
    `

    // Cliques por dia nos últimos 7 dias
    const clicksByDay = await sql`
      SELECT 
        DATE(lc."createdAt") as date,
        COUNT(*) as count
      FROM "LinkClick" lc
      JOIN "Link" l ON lc."linkId" = l.id
      WHERE l."userId" = ${userId}
        AND lc."createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(lc."createdAt")
      ORDER BY date ASC
    `

    // Visualizações do perfil por dia nos últimos 7 dias
    const viewsByDay = await sql`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "ProfileView"
      WHERE "userId" = ${userId}
        AND "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    return res.status(200).json({
      success: true,
      data: {
        totalLinks: Number.parseInt(totalLinks[0].count),
        totalClicks: Number.parseInt(totalClicks[0].count),
        profileViews: Number.parseInt(profileViews[0].count),
        topLinks,
        clicksByDay,
        viewsByDay,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar estatísticas",
    })
  }
}

// Obter estatísticas detalhadas de um link específico
export const getLinkStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { linkId } = req.params

    // Verificar se o link existe e pertence ao usuário
    const link = await sql`
      SELECT * FROM "Link"
      WHERE id = ${linkId} AND "userId" = ${userId}
    `

    if (link.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Link não encontrado",
      })
    }

    // Total de cliques
    const totalClicks = link[0].clicks

    // Cliques por dia nos últimos 30 dias
    const clicksByDay = await sql`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "LinkClick"
      WHERE "linkId" = ${linkId}
        AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // Cliques por referenciador (top 5)
    const clicksByReferrer = await sql`
      SELECT 
        referrer,
        COUNT(*) as count
      FROM "LinkClick"
      WHERE "linkId" = ${linkId}
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 5
    `

    // Cliques por dispositivo (baseado no User-Agent)
    const clicksByDevice = await sql`
      SELECT 
        CASE
          WHEN "userAgent" LIKE '%Android%' THEN 'Android'
          WHEN "userAgent" LIKE '%iPhone%' THEN 'iPhone'
          WHEN "userAgent" LIKE '%iPad%' THEN 'iPad'
          WHEN "userAgent" LIKE '%Windows%' THEN 'Windows'
          WHEN "userAgent" LIKE '%Mac%' THEN 'Mac'
          WHEN "userAgent" LIKE '%Linux%' THEN 'Linux'
          ELSE 'Outro'
        END as device,
        COUNT(*) as count
      FROM "LinkClick"
      WHERE "linkId" = ${linkId}
      GROUP BY device
      ORDER BY count DESC
    `

    return res.status(200).json({
      success: true,
      data: {
        linkInfo: link[0],
        totalClicks,
        clicksByDay,
        clicksByReferrer,
        clicksByDevice,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas do link:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar estatísticas do link",
    })
  }
}
