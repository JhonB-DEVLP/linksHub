import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../index"
import { AppError } from "../middleware/error.middleware"

// Gerar token JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  })
}

// Configurar cookie com o token
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user.id)

  const cookieOptions = {
    expires: new Date(
      Date.now() + (Number.parseInt(process.env.JWT_COOKIE_EXPIRE as string) || 30) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    })
}

// Registrar novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username } = req.body

    // Verificar se o email já está em uso
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      throw new AppError("Email já está em uso", 400)
    }

    // Verificar se o username já está em uso
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      throw new AppError("Nome de usuário já está em uso", 400)
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        role: "user",
        profile: {
          create: {
            title: name,
            bio: "",
            theme: "default",
            background: "gradient",
            showAvatar: true,
            roundedCorners: true,
            darkMode: false,
          },
        },
      },
    })

    // Enviar resposta com token
    sendTokenResponse(user, 201, res)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao registrar usuário" })
    }
  }
}

// Login de usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validar email e senha
    if (!email || !password) {
      throw new AppError("Por favor, forneça email e senha", 400)
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError("Credenciais inválidas", 401)
    }

    // Verificar se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new AppError("Credenciais inválidas", 401)
    }

    // Enviar resposta com token
    sendTokenResponse(user, 200, res)
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao fazer login" })
    }
  }
}

// Obter usuário atual
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter usuário" })
  }
}

// Logout
export const logout = (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logout realizado com sucesso",
  })
}
