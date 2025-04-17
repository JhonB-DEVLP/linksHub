import type { Request, Response } from "express"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"
import type { AuthenticatedRequest } from "../middleware/authMiddleware"

const sql = neon(process.env.DATABASE_URL!)

// Obter perfil do usuário autenticado
export const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id

    const profile = await sql`
      SELECT * FROM "Profile"
      WHERE "userId" = ${userId}
    `

    if (profile.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Perfil não encontrado",
      })
    }

    return res.status(200).json({
      success: true,
      data: profile[0],
    })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar perfil",
    })
  }
}

// Atualizar perfil do usuário
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const { title, bio, avatar, theme, background, showAvatar, roundedCorners, darkMode } = req.body

    // Verificar se o perfil existe
    const existingProfile = await sql`
      SELECT * FROM "Profile"
      WHERE "userId" = ${userId}
    `

    if (existingProfile.length === 0) {
      // Criar um novo perfil se não existir
      const newProfile = await sql`
        INSERT INTO "Profile" (
          id, title, bio, avatar, theme, background, 
          "showAvatar", "roundedCorners", "darkMode", 
          "createdAt", "updatedAt", "userId"
        )
        VALUES (
          ${uuidv4()}, ${title || ""}, ${bio || ""}, 
          ${avatar || "/mystical-forest-spirit.png"}, 
          ${theme || "default"}, ${background || "gradient"}, 
          ${showAvatar !== undefined ? showAvatar : true}, 
          ${roundedCorners !== undefined ? roundedCorners : true}, 
          ${darkMode !== undefined ? darkMode : false}, 
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${userId}
        )
        RETURNING *
      `

      return res.status(201).json({
        success: true,
        data: newProfile[0],
      })
    }

    // Atualizar o perfil existente
    const updatedProfile = await sql`
      UPDATE "Profile"
      SET 
        title = COALESCE(${title}, title),
        bio = COALESCE(${bio}, bio),
        avatar = COALESCE(${avatar}, avatar),
        theme = COALESCE(${theme}, theme),
        background = COALESCE(${background}, background),
        "showAvatar" = COALESCE(${showAvatar}, "showAvatar"),
        "roundedCorners" = COALESCE(${roundedCorners}, "roundedCorners"),
        "darkMode" = COALESCE(${darkMode}, "darkMode"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = ${userId}
      RETURNING *
    `

    return res.status(200).json({
      success: true,
      data: updatedProfile[0],
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao atualizar perfil",
    })
  }
}

// Obter perfil público por nome de usuário
export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    const referrer = req.get("Referrer") || "direct"
    const userAgent = req.get("User-Agent") || ""

    // Buscar usuário pelo nome de usuário
    const user = await sql`
      SELECT id, name, username FROM "User"
      WHERE username = ${username}
    `

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      })
    }

    const userId = user[0].id

    // Buscar perfil do usuário
    const profile = await sql`
      SELECT * FROM "Profile"
      WHERE "userId" = ${userId}
    `

    // Buscar links ativos do usuário
    const links = await sql`
      SELECT id, title, url, description, category, icon, position
      FROM "Link"
      WHERE "userId" = ${userId} AND active = true
      ORDER BY position ASC
    `

    // Registrar visualização do perfil
    await sql`
      INSERT INTO "ProfileView" (
        id, referrer, "userAgent", "createdAt", "userId"
      )
      VALUES (
        ${uuidv4()}, ${referrer}, ${userAgent}, CURRENT_TIMESTAMP, ${userId}
      )
    `

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: user[0].name,
          username: user[0].username,
        },
        profile: profile.length > 0 ? profile[0] : null,
        links,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar perfil público:", error)
    return res.status(500).json({
      success: false,
      error: "Erro ao buscar perfil público",
    })
  }
}
