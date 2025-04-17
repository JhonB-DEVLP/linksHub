import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validação do email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Email inválido" }, { status: 400 })
    }

    // Verificar se o usuário existe
    const users = await executeQuery(`SELECT * FROM "User" WHERE email = $1`, [email])

    // Não revelar se o email existe ou não por segurança
    if (users.length === 0) {
      // Retornamos sucesso mesmo se o email não existir para evitar enumeração de usuários
      return NextResponse.json({
        success: true,
        message: "Se o email estiver registrado, você receberá instruções para redefinir sua senha.",
      })
    }

    const user = users[0]

    // Gerar token de redefinição de senha
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no banco de dados
    await executeQuery(`UPDATE "User" SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3`, [
      resetToken,
      resetTokenExpiry,
      user.id,
    ])

    // Construir URL de redefinição
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // Enviar email
    await sendEmail({
      to: email,
      subject: "Redefinição de Senha - LinkHub",
      text: `Você solicitou a redefinição de sua senha. Por favor, clique no link a seguir para redefinir sua senha: ${resetUrl}. Este link é válido por 1 hora.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de Senha - LinkHub</h2>
          <p>Você solicitou a redefinição de sua senha.</p>
          <p>Clique no botão abaixo para redefinir sua senha:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Redefinir Senha</a>
          <p>Ou copie e cole o seguinte link no seu navegador:</p>
          <p>${resetUrl}</p>
          <p>Este link é válido por 1 hora.</p>
          <p>Se você não solicitou a redefinição de senha, por favor ignore este email.</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Se o email estiver registrado, você receberá instruções para redefinir sua senha.",
    })
  } catch (error) {
    console.error("Erro ao processar solicitação de redefinição de senha:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
      },
      { status: 500 },
    )
  }
}
