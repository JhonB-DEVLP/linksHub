import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCurrentUser } from "@/lib/jwt"
import { validateData, profileSchema } from "@/lib/validation"

export async function GET() {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId

    // Buscar o perfil do usuário
    const profiles = await executeQuery(
      `
      SELECT * FROM "Profile"
      WHERE "userId" = $1
    `,
      [userId],
    )

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, message: "Perfil não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: profiles[0] })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const body = await request.json()

    // Validar os dados
    const validation = validateData(profileSchema, body)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    const { title, bio, avatar, theme, background, showAvatar, roundedCorners, darkMode } = validation.data

    // Verificar se o perfil existe
    const existingProfiles = await executeQuery(
      `
      SELECT * FROM "Profile"
      WHERE "userId" = $1
    `,
      [userId],
    )

    if (existingProfiles.length === 0) {
      // Criar um novo perfil se não existir
      const newProfile = await executeQuery(
        `
        INSERT INTO "Profile" (
          id, title, bio, avatar, theme, background, 
          "showAvatar", "roundedCorners", "darkMode", 
          "createdAt", "updatedAt", "userId"
        )
        VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, 
          $6, $7, $8, 
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9
        )
        RETURNING *
      `,
        [
          title || "",
          bio || "",
          avatar || "",
          theme || "default",
          background || "gradient",
          showAvatar !== undefined ? showAvatar : true,
          roundedCorners !== undefined ? roundedCorners : true,
          darkMode !== undefined ? darkMode : false,
          userId,
        ],
      )

      return NextResponse.json({
        success: true,
        data: newProfile[0],
      })
    }

    // Atualizar o perfil existente
    const updatedProfile = await executeQuery(
      `
      UPDATE "Profile"
      SET 
        title = COALESCE($1, title),
        bio = COALESCE($2, bio),
        avatar = COALESCE($3, avatar),
        theme = COALESCE($4, theme),
        background = COALESCE($5, background),
        "showAvatar" = COALESCE($6, "showAvatar"),
        "roundedCorners" = COALESCE($7, "roundedCorners"),
        "darkMode" = COALESCE($8, "darkMode"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "userId" = $9
      RETURNING *
    `,
      [title, bio, avatar, theme, background, showAvatar, roundedCorners, darkMode, userId],
    )

    return NextResponse.json({
      success: true,
      data: updatedProfile[0],
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar perfil" }, { status: 500 })
  }
}
