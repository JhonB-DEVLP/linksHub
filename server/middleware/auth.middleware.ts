import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../index"

// Estendendo a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se o token existe
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Acesso não autorizado. Token não fornecido." })
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }

    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado ou token inválido." })
    }

    // Adicionar o usuário à requisição
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." })
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Acesso não autorizado." })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso proibido. Permissão insuficiente." })
    }

    next()
  }
}
