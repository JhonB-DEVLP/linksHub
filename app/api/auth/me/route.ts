import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCurrentUser } from "@/lib/jwt"

export async function GET() {
  try {
    // Obter o usuário atual a partir do token JWT
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    }

    // Buscar dados do usuário no banco de dados
    const users = await executeQuery(
      `
      SELECT u.id, u.name, u.email, u.username, u.role, p.*
      FROM "User" u
      LEFT JOIN "Profile" p ON u.id = p.userId
      WHERE u.id = $1
    `,
      [currentUser.userId],
    )

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: {
          title: user.title,
          bio: user.bio,
          avatar: user.avatar,
          theme: user.theme,
          background: user.background,
          showAvatar: user.showAvatar,
          roundedCorners: user.roundedCorners,
          darkMode: user.darkMode,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return NextResponse.json({ success: false, message: "Erro ao obter usuário atual" }, { status: 500 })
  }
}
