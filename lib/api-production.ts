/**
 * Versão otimizada do cliente API para produção
 */
import { getAuthToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.linkhub-production.vercel.app/api"

// Cache para respostas
const cache = new Map()

// Tempo de expiração do cache em ms (5 minutos)
const CACHE_EXPIRY = 5 * 60 * 1000

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache = false,
  cacheKey?: string,
): Promise<T> {
  const token = getAuthToken()
  const url = `${API_URL}${endpoint}`

  // Configuração padrão
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  }

  const fetchOptions = { ...defaultOptions, ...options }

  // Verificar cache se useCache for true e o método for GET
  if (useCache && (!options.method || options.method === "GET")) {
    const key = cacheKey || url
    const cachedResponse = cache.get(key)

    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_EXPIRY) {
      return cachedResponse.data
    }
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Armazenar no cache se useCache for true e o método for GET
    if (useCache && (!options.method || options.method === "GET")) {
      const key = cacheKey || url
      cache.set(key, { data, timestamp: Date.now() })
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Limpar cache
export function clearApiCache(keyPattern?: string): void {
  if (keyPattern) {
    // Limpar entradas específicas do cache
    for (const key of cache.keys()) {
      if (key.includes(keyPattern)) {
        cache.delete(key)
      }
    }
  } else {
    // Limpar todo o cache
    cache.clear()
  }
}
