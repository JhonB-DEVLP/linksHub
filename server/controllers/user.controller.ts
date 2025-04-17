import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { prisma } from "../index"
import { AppError } from "../middleware/error.middleware"

// Atualizar perfil do usuário
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { name, email, username, bio, avatar } = req.body

    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      })

      if (existingEmail) {
        throw new AppError("Email já está em uso", 400)
      }
    }

    // Verificar se o username já está em uso por outro usuário
    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId },
        },
      })

      if (existingUsername) {
        throw new AppError("Nome de usuário já está em uso", 400)
      }
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        email: email,
        username: username,
      },
    })

    // Atualizar perfil se bio ou avatar foram fornecidos
    if (bio || avatar) {
      await prisma.profile.update({
        where: { userId },
        data: {
          bio: bio,
          avatar: avatar,
        },
      })
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao atualizar perfil" })
    }
  }
}

// Atualizar senha
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { currentPassword, newPassword } = req.body

    // Verificar se as senhas foram fornecidas
    if (!currentPassword || !newPassword) {
      throw new AppError("Por favor, forneça a senha atual e a nova senha", 400)
    }

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    // Verificar se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      throw new AppError("Senha atual incorreta", 401)
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    res.status(200).json({
      success: true,
      message: "Senha atualizada com sucesso",
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao atualizar senha" })
    }
  }
}

// Atualizar configurações de aparência
export const updateAppearance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { theme, background, showAvatar, roundedCorners, darkMode } = req.body

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        theme,
        background,
        showAvatar,
        roundedCorners,
        darkMode,
      },
    })

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar aparência" })
  }
}

// Obter perfil público de um usuário pelo username
export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        profile: true,
        links: {
          where: { active: true },
          orderBy: { position: "asc" },
        },
      },
    })

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    // Registrar visualização
    await prisma.profileView.create({
      data: {
        userId: user.id,
        referrer: req.headers.referer || "direct",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao obter perfil público" })
    }
  }
}
