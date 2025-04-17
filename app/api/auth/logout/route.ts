import { NextResponse } from "next/server"
import { removeJwtCookie } from "@/lib/jwt"

export async function GET() {
  // Remover o cookie JWT
  removeJwtCookie()

  return NextResponse.json({
    success: true,
    message: "Logout realizado com sucesso",
  })
}
