import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { executeQuery } from "@/server/utils/db"
import { signJwtToken, setJwtCookie } from "@/lib/jwt"
import { validateData, registerSchema } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar os dados
    const validation = validateData(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    const { name, email, username, password } = validation.data

    // Verificar se o email já está em uso
    const existingEmail = await executeQuery(`SELECT * FROM "User" WHERE email = $1`, [email])
    if (existingEmail.length > 0) {
      return NextResponse.json({ success: false, message: "Email já está em uso" }, { status: 400 })
    }

    // Verificar se o username já está em uso
    const existingUsername = await executeQuery(`SELECT * FROM "User" WHERE username = $1`, [username])
    if (existingUsername.length > 0) {
      return NextResponse.json({ success: false, message: "Nome de usuário já está em uso" }, { status: 400 })
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Criar usuário
    const userId = crypto.randomUUID()
    const profileId = crypto.randomUUID()

    // Iniciar uma transação
    await executeQuery("BEGIN")

    try {
      // Inserir usuário
      await executeQuery(
        `
        INSERT INTO "User" (id, name, email, username, password, role, "resetToken", "resetTokenExpiry")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [userId, name, email, username, hashedPassword, "user", null, null],
      )

      // Inserir perfil
      await executeQuery(
        `
        INSERT INTO "Profile" (id, title, bio, theme, background, "showAvatar", "roundedCorners", "darkMode", "userId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [profileId, name, "", "default", "gradient", true, true, false, userId],
      )

      // Confirmar a transação
      await executeQuery("COMMIT")
    } catch (error) {
      // Reverter a transação em caso de erro
      await executeQuery("ROLLBACK")
      throw error
    }

    // Gerar token JWT
    const token = signJwtToken({
      userId,
      email,
      role: "user",
    })

    // Definir o token como cookie
    setJwtCookie(token)

    return NextResponse.json({
      success: true,
      message: "Usuário registrado com sucesso",
      user: {
        id: userId,
        name,
        email,
        username,
      },
    })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro ao registrar usuário" }, { status: 500 })
  }
}
