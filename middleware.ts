import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwtToken } from "./lib/jwt"

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/forgot-password",
  "/api/auth/verify-reset-token",
  "/api/auth/reset-password",
]

// Rotas que começam com esses prefixos não precisam de autenticação
const publicPathPrefixes = ["/u/", "/reset-password/", "/api/users/public/", "/api/links/click/"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se a rota é pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificar se a rota começa com um prefixo público
  if (publicPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Verificar se é uma rota de recursos estáticos
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/uploads/")
  ) {
    return NextResponse.next()
  }

  // Obter o token do cookie
  const token = request.cookies.get("token")?.value

  // Se não houver token, redirecionar para login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Verificar se o token é válido
  const payload = verifyJwtToken(token)
  if (!payload) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Token é válido, continuar
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
