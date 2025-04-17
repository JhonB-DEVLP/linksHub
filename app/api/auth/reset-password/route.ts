import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validação
    if (!token || !password) {
      return NextResponse.json({ success: false, message: "Token e senha são obrigatórios" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "A senha deve ter pelo menos 8 caracteres" }, { status: 400 })
    }

    // Verificar se o token existe e não expirou
    const users = await executeQuery(`SELECT * FROM "User" WHERE "resetToken" = $1 AND "resetTokenExpiry" > $2`, [
      token,
      new Date(),
    ])

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Token inválido ou expirado" }, { status: 400 })
    }

    const user = users[0]

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Atualizar senha e limpar token
    await executeQuery(
      `UPDATE "User" SET password = $1, "resetToken" = NULL, "resetTokenExpiry" = NULL WHERE id = $2`,
      [hashedPassword, user.id],
    )

    return NextResponse.json({ success: true, message: "Senha redefinida com sucesso" })
  } catch (error) {
    console.error("Erro ao redefinir senha:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente mais tarde.",
      },
      { status: 500 },
    )
  }
}
