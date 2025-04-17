import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Chave secreta para assinar os tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Duração do token (em segundos)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d"

// Duração do cookie (em dias)
const JWT_COOKIE_EXPIRE = Number.parseInt(process.env.JWT_COOKIE_EXPIRE || "30", 10)

// Interface para o payload do token
export interface JwtPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Gerar um token JWT
export function signJwtToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// Verificar e decodificar um token JWT
export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

// Definir o token JWT como cookie
export function setJwtCookie(token: string) {
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: JWT_COOKIE_EXPIRE * 24 * 60 * 60, // Converter dias para segundos
    path: "/",
  })
}

// Remover o cookie JWT
export function removeJwtCookie() {
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}

// Obter o token JWT do cookie
export function getJwtFromCookies(): string | undefined {
  return cookies().get("token")?.value
}

// Obter o usuário atual a partir do token JWT
export function getCurrentUser(): JwtPayload | null {
  const token = getJwtFromCookies()
  if (!token) return null
  return verifyJwtToken(token)
}
