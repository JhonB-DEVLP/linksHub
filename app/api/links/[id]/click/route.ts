import { NextResponse } from "next/server"
import { executeQuery } from "@/server/utils/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { referrer, userAgent } = body

    // Verificar se o link existe
    const links = await executeQuery(
      `
      SELECT * FROM "Link"
      WHERE id = $1
    `,
      [id],
    )

    if (links.length === 0) {
      return NextResponse.json({ success: false, message: "Link não encontrado" }, { status: 404 })
    }

    // Registrar o clique
    await executeQuery(
      `
      INSERT INTO "LinkClick" (
        id, referrer, "userAgent", "createdAt", "linkId"
      )
      VALUES (
        gen_random_uuid(), $1, $2, CURRENT_TIMESTAMP, $3
      )
    `,
      [referrer || "direct", userAgent || "unknown", id],
    )

    // Incrementar o contador de cliques
    await executeQuery(
      `
      UPDATE "Link"
      SET clicks = clicks + 1
      WHERE id = $1
    `,
      [id],
    )

    return NextResponse.json({
      success: true,
      message: "Clique registrado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao registrar clique:", error)
    return NextResponse.json({ success: false, message: "Erro ao registrar clique" }, { status: 500 })
  }
}
