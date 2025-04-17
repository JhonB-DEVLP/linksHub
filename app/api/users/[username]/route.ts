import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params

    // Buscar usuário pelo nome de usuário
    const users = await executeQuery(
      `
      SELECT id, name, username FROM "User"
      WHERE username = $1
    `,
      [username],
    )

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
    }

    const userId = users[0].id

    // Buscar perfil do usuário
    const profiles = await executeQuery(
      `
      SELECT * FROM "Profile"
      WHERE "userId" = $1
    `,
      [userId],
    )

    // Buscar links ativos do usuário
    const links = await executeQuery(
      `
      SELECT id, title, url, description, category, icon, position
      FROM "Link"
      WHERE "userId" = $1 AND active = true
      ORDER BY position ASC
    `,
      [userId],
    )

    // Registrar visualização do perfil
    await executeQuery(
      `
      INSERT INTO "ProfileView" (
        id, referrer, "userAgent", "createdAt", "userId"
      )
      VALUES (
        gen_random_uuid(), $1, $2, CURRENT_TIMESTAMP, $3
      )
    `,
      [request.headers.get("referer") || "direct", request.headers.get("user-agent") || "unknown", userId],
    )

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: users[0].name,
          username: users[0].username,
        },
        profile: profiles.length > 0 ? profiles[0] : null,
        links,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar perfil público:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar perfil público" }, { status: 500 })
  }
}
