import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCurrentUser } from "@/lib/jwt"
import { validateData, linkSchema } from "@/lib/validation"

export async function GET() {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId

    // Buscar todos os links do usuário
    const links = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE "userId" = $1
      ORDER BY position ASC
    `,
      [userId],
    )

    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    console.error("Erro ao buscar links:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar links" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const body = await request.json()

    // Validar os dados
    const validation = validateData(linkSchema, body)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    const { title, url, description, category, icon, active } = validation.data

    // Obter a posição mais alta
    const positionResult = await executeQuery(
      `
      SELECT COALESCE(MAX(position), -1) + 1 as next_position
      FROM "Link"
      WHERE "userId" = $1
    `,
      [userId],
    )

    const position = positionResult[0].next_position || 0

    // Criar o link
    const newLink = await executeQuery(
      `
      INSERT INTO "Link" (
        id, title, url, description, category, icon, 
        position, active, clicks, "createdAt", "updatedAt", "userId"
      )
      VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, 
        $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9
      )
      RETURNING *
    `,
      [title, url, description || "", category || "other", icon || "Link", position, active !== false, 0, userId],
    )

    return NextResponse.json({
      success: true,
      data: newLink[0],
    })
  } catch (error) {
    console.error("Erro ao criar link:", error)
    return NextResponse.json({ success: false, message: "Erro ao criar link" }, { status: 500 })
  }
}
