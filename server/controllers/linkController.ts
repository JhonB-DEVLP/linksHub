import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { neon } from "@neondatabase/serverless"
import type { AuthenticatedRequest } from "../middleware/authMiddleware"

const sql = neon(process.env.DATABASE_URL!)

// Obter todos os links do usuário
export const getLinks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id

    const links = await sql`
      SELECT * FROM "Link"
      WHERE "userId" = ${userId}
      ORDER BY position ASC
    `

    return res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    })
  } catch (error) {
    console.error("Erro ao buscar links:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar links",
    })
  }
}

// Obter um link específico
export const getLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const linkId = req.params.id

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

    return res.status(200).json({
      success: true,
      data: link[0],
    })
  } catch (error) {
    console.error("Erro ao buscar link:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar link",
    })
  }
}

// Criar um novo link
export const createLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { title, url, description, category, icon } = req.body

    // Validação básica
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        error: "Por favor, forneça título e URL",
      })
    }

    // Obter a posição mais alta atual para adicionar o novo link no final
    const positionResult = await sql`
      SELECT COALESCE(MAX(position), -1) + 1 as next_position
      FROM "Link"
      WHERE "userId" = ${userId}
    `

    const position = positionResult[0].next_position || 0

    const newLink = await sql`
      INSERT INTO "Link" (
        id, title, url, description, category, icon, 
        position, active, clicks, "createdAt", "updatedAt", "userId"
      )
      VALUES (
        ${uuidv4()}, ${title}, ${url}, ${description || ""}, 
        ${category || "other"}, ${icon || "Link"}, ${position}, 
        ${true}, ${0}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${userId}
      )
      RETURNING *
    `

    return res.status(201).json({
      success: true,
      data: newLink[0],
    })
  } catch (error) {
    console.error("Erro ao criar link:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao criar link",
    })
  }
}

// Atualizar um link existente
export const updateLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const linkId = req.params.id
    const { title, url, description, category, icon, position, active } = req.body

    // Verificar se o link existe e pertence ao usuário
    const existingLink = await sql`
      SELECT * FROM "Link"
      WHERE id = ${linkId} AND "userId" = ${userId}
    `

    if (existingLink.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Link não encontrado",
      })
    }

    // Atualizar o link
    const updatedLink = await sql`
      UPDATE "Link"
      SET 
        title = COALESCE(${title}, title),
        url = COALESCE(${url}, url),
        description = COALESCE(${description}, description),
        category = COALESCE(${category}, category),
        icon = COALESCE(${icon}, icon),
        position = COALESCE(${position}, position),
        active = COALESCE(${active}, active),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = ${linkId} AND "userId" = ${userId}
      RETURNING *
    `

    return res.status(200).json({
      success: true,
      data: updatedLink[0],
    })
  } catch (error) {
    console.error("Erro ao atualizar link:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao atualizar link",
    })
  }
}

// Excluir um link
export const deleteLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const linkId = req.params.id

    // Verificar se o link existe e pertence ao usuário
    const existingLink = await sql`
      SELECT * FROM "Link"
      WHERE id = ${linkId} AND "userId" = ${userId}
    `

    if (existingLink.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Link não encontrado",
      })
    }

    // Excluir o link
    await sql`
      DELETE FROM "Link"
      WHERE id = ${linkId} AND "userId" = ${userId}
    `

    // Reordenar os links restantes
    await sql`
      WITH ranked_links AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY position) - 1 as new_position
        FROM "Link"
        WHERE "userId" = ${userId}
      )
      UPDATE "Link" SET
        position = ranked_links.new_position
      FROM ranked_links
      WHERE "Link".id = ranked_links.id
    `

    return res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    console.error("Erro ao excluir link:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao excluir link",
    })
  }
}

// Reordenar links
export const reorderLinks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { linkOrder } = req.body

    if (!Array.isArray(linkOrder)) {
      return res.status(400).json({
        success: false,
        error: "linkOrder deve ser um array de IDs",
      })
    }

    // Atualizar a posição de cada link
    for (let i = 0; i < linkOrder.length; i++) {
      await sql`
        UPDATE "Link"
        SET position = ${i}, "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${linkOrder[i]} AND "userId" = ${userId}
      `
    }

    // Buscar os links atualizados
    const updatedLinks = await sql`
      SELECT * FROM "Link"
      WHERE "userId" = ${userId}
      ORDER BY position ASC
    `

    return res.status(200).json({
      success: true,
      data: updatedLinks,
    })
  } catch (error) {
    console.error("Erro ao reordenar links:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao reordenar links",
    })
  }
}

// Registrar clique em um link
export const registerLinkClick = async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params
    const referrer = req.get("Referrer") || "direct"
    const userAgent = req.get("User-Agent") || ""

    // Verificar se o link existe
    const link = await sql`
      SELECT * FROM "Link"
      WHERE id = ${linkId}
    `

    if (link.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Link não encontrado",
      })
    }

    // Registrar o clique
    await sql`
      INSERT INTO "LinkClick" (
        id, referrer, "userAgent", "createdAt", "linkId"
      )
      VALUES (
        ${uuidv4()}, ${referrer}, ${userAgent}, CURRENT_TIMESTAMP, ${linkId}
      )
    `

    // Incrementar o contador de cliques
    await sql`
      UPDATE "Link"
      SET clicks = clicks + 1
      WHERE id = ${linkId}
    `

    return res.status(200).json({
      success: true,
      data: { url: link[0].url },
    })
  } catch (error) {
    console.error("Erro ao registrar clique:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao registrar clique",
    })
  }
}
