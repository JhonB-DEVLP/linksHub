import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { executeQuery } from "@/server/utils/db"
import { signJwtToken, setJwtCookie } from "@/lib/jwt"
import { validateData, loginSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar os dados
    const validation = validateData(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    const { email, password } = validation.data

    // Buscar usuário pelo email
    const users = await executeQuery(`SELECT * FROM "User" WHERE email = $1`, [email])
    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = signJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Definir o token como cookie
    setJwtCookie(token)

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ success: false, message: "Erro ao fazer login" }, { status: 500 })
  }
}
