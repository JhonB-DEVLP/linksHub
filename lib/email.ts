import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

// Configurar o transporte de email
const createTransporter = () => {
  // Para desenvolvimento, você pode usar um serviço de teste como Ethereal
  // Para produção, configure com seu provedor de email real (Gmail, SendGrid, etc.)
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  } else {
    // Para desenvolvimento, usamos o serviço Ethereal para testes
    // Os emails não são realmente enviados, mas podem ser visualizados no console
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "ethereal.user@ethereal.email", // Substitua por credenciais do Ethereal se necessário
        pass: "ethereal_pass",
      },
    })
  }
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: `"LinkHub" <${process.env.EMAIL_FROM || "noreply@linkhub.com"}>`,
      to,
      subject,
      text,
      html,
    })

    if (process.env.NODE_ENV !== "production") {
      // Em desenvolvimento, exibir URL de visualização do Ethereal
      console.log("Email enviado (desenvolvimento):", info)
      console.log("URL de visualização:", nodemailer.getTestMessageUrl(info))
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    throw new Error("Falha ao enviar email")
  }
}
