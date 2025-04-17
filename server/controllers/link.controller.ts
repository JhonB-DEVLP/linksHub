import type { Request, Response } from "express"
import { prisma } from "../index"
import { AppError } from "../middleware/error.middleware"

// Obter todos os links do usuário
export const getLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { category } = req.query

    const whereClause: any = { userId }

    if (category && category !== "all") {
      whereClause.category = category
    }

    const links = await prisma.link.findMany({
      where: whereClause,
      orderBy: { position: "asc" },
    })

    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter links" })
  }
}

// Obter um link específico
export const getLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const link = await prisma.link.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!link) {
      throw new AppError("Link não encontrado", 404)
    }

    res.status(200).json({
      success: true,
      data: link,
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao obter link" })
    }
  }
}

// Criar um novo link
export const createLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { title, url, description, category } = req.body

    // Obter a posição mais alta atual
    const highestPositionLink = await prisma.link.findFirst({
      where: { userId },
      orderBy: { position: "desc" },
    })

    const position = highestPositionLink ? highestPositionLink.position + 1 : 0

    const link = await prisma.link.create({
      data: {
        title,
        url,
        description,
        category,
        position,
        user: { connect: { id: userId } },
      },
    })

    res.status(201).json({
      success: true,
      data: link,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar link" })
  }
}

// Atualizar um link
export const updateLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { title, url, description, category } = req.body

    // Verificar se o link existe e pertence ao usuário
    const existingLink = await prisma.link.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingLink) {
      throw new AppError("Link não encontrado", 404)
    }

    const link = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        description,
        category,
      },
    })

    res.status(200).json({
      success: true,
      data: link,
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao atualizar link" })
    }
  }
}

// Excluir um link
export const deleteLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Verificar se o link existe e pertence ao usuário
    const existingLink = await prisma.link.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingLink) {
      throw new AppError("Link não encontrado", 404)
    }

    await prisma.link.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao excluir link" })
    }
  }
}

// Reordenar links
export const reorderLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { links } = req.body

    if (!Array.isArray(links)) {
      throw new AppError("Links inválidos", 400)
    }

    // Iniciar uma transação para garantir que todas as atualizações sejam feitas ou nenhuma
    await prisma.$transaction(
      links.map((link, index) =>
        prisma.link.updateMany({
          where: { id: link.id, userId },
          data: { position: index },
        }),
      ),
    )

    res.status(200).json({
      success: true,
      message: "Links reordenados com sucesso",
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao reordenar links" })
    }
  }
}

// Registrar clique em um link
export const registerClick = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { referrer, userAgent } = req.body

    // Verificar se o link existe
    const link = await prisma.link.findUnique({
      where: { id },
    })

    if (!link) {
      throw new AppError("Link não encontrado", 404)
    }

    // Registrar o clique
    await prisma.linkClick.create({
      data: {
        linkId: id,
        referrer: referrer || "direct",
        userAgent: userAgent || "unknown",
      },
    })

    // Incrementar o contador de cliques do link
    await prisma.link.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
      },
    })

    res.status(200).json({
      success: true,
      message: "Clique registrado com sucesso",
    })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message })
    } else {
      res.status(500).json({ success: false, message: "Erro ao registrar clique" })
    }
  }
}
