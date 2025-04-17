import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCurrentUser } from "@/lib/jwt"
import { validateData, linkSchema } from "@/lib/validation"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const { id } = params

    // Buscar o link
    const links = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE id = $1 AND "userId" = $2
    `,
      [id, userId],
    )

    if (links.length === 0) {
      return NextResponse.json({ success: false, message: "Link não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: links[0] })
  } catch (error) {
    console.error("Erro ao buscar link:", error)
    return NextResponse.json({ success: false, message: "Erro ao buscar link" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const { id } = params
    const body = await request.json()

    // Validar os dados
    const validation = validateData(linkSchema, body)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 })
    }

    const { title, url, description, category, icon, active } = validation.data

    // Verificar se o link existe e pertence ao usuário
    const existingLinks = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE id = $1 AND "userId" = $2
    `,
      [id, userId],
    )

    if (existingLinks.length === 0) {
      return NextResponse.json({ success: false, message: "Link não encontrado" }, { status: 404 })
    }

    // Atualizar o link
    const updatedLink = await executeQuery(
      `
      UPDATE "Link"
      SET 
        title = $1,
        url = $2,
        description = $3,
        category = $4,
        icon = $5,
        active = $6,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $7 AND "userId" = $8
      RETURNING *
    `,
      [title, url, description || "", category, icon || "Link", active !== false, id, userId],
    )

    return NextResponse.json({
      success: true,
      data: updatedLink[0],
    })
  } catch (error) {
    console.error("Erro ao atualizar link:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar link" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const { id } = params

    // Verificar se o link existe e pertence ao usuário
    const existingLinks = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE id = $1 AND "userId" = $2
    `,
      [id, userId],
    )

    if (existingLinks.length === 0) {
      return NextResponse.json({ success: false, message: "Link não encontrado" }, { status: 404 })
    }

    // Excluir o link
    await executeQuery(
      `
      DELETE FROM "Link"
      WHERE id = $1 AND "userId" = $2
    `,
      [id, userId],
    )

    // Reordenar os links restantes
    await executeQuery(
      `
      WITH ranked_links AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY position) - 1 as new_position
        FROM "Link"
        WHERE "userId" = $1
      )
      UPDATE "Link" SET
        position = ranked_links.new_position
      FROM ranked_links
      WHERE "Link".id = ranked_links.id
    `,
      [userId],
    )

    return NextResponse.json({
      success: true,
      message: "Link excluído com sucesso",
    })
  } catch (error) {
    console.error("Erro ao excluir link:", error)
    return NextResponse.json({ success: false, message: "Erro ao excluir link" }, { status: 500 })
  }
}
