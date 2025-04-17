import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"
import { getCurrentUser } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 })
    }

    const userId = currentUser.userId
    const { linkOrder } = await request.json()

    if (!Array.isArray(linkOrder)) {
      return NextResponse.json({ success: false, message: "Formato inválido" }, { status: 400 })
    }

    // Verificar se todos os links pertencem ao usuário
    const links = await executeQuery(
      `
      SELECT id FROM "Link"
      WHERE "userId" = $1
    `,
      [userId],
    )

    const userLinkIds = links.map((link) => link.id)
    const allLinksExist = linkOrder.every((id) => userLinkIds.includes(id))

    if (!allLinksExist) {
      return NextResponse.json({ success: false, message: "Links inválidos" }, { status: 400 })
    }

    // Iniciar uma transação
    await executeQuery("BEGIN")

    try {
      // Atualizar a posição de cada link
      for (let i = 0; i < linkOrder.length; i++) {
        await executeQuery(
          `
          UPDATE "Link"
          SET position = $1, "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $2 AND "userId" = $3
        `,
          [i, linkOrder[i], userId],
        )
      }

      // Confirmar a transação
      await executeQuery("COMMIT")
    } catch (error) {
      // Reverter a transação em caso de erro
      await executeQuery("ROLLBACK")
      throw error
    }

    // Buscar os links atualizados
    const updatedLinks = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE "userId" = $1
      ORDER BY position ASC
    `,
      [userId],
    )

    return NextResponse.json({
      success: true,
      data: updatedLinks,
    })
  } catch (error) {
    console.error("Erro ao reordenar links:", error)
    return NextResponse.json({ success: false, message: "Erro ao reordenar links" }, { status: 500 })
  }
}
