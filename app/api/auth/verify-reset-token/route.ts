import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, message: "Token não fornecido" }, { status: 400 })
    }

    // Verificar se o token existe e não expirou
    const users = await executeQuery(`SELECT * FROM "User" WHERE "resetToken" = $1 AND "resetTokenExpiry" > $2`, [
      token,
      new Date(),
    ])

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Token inválido ou expirado" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao verificar token de redefinição:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao verificar o token. Por favor, tente novamente mais tarde.",
      },
      { status: 500 },
    )
  }
}
