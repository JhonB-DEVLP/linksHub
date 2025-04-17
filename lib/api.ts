import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Configurar axios com credenciais
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Funções de autenticação
export const registerUser = async (userData: any) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

export const loginUser = async (credentials: any) => {
  const response = await api.post("/auth/login", credentials)
  return response.data
}

export const logoutUser = async () => {
  const response = await api.get("/auth/logout")
  return response.data
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me")
    return response.data
  } catch (error) {
    return null
  }
}

// Funções de gerenciamento de links
export const getLinks = async () => {
  const response = await api.get("/links")
  return response.data
}

export const getLink = async (id: string) => {
  const response = await api.get(`/links/${id}`)
  return response.data
}

export const createLink = async (linkData: any) => {
  const response = await api.post("/links", linkData)
  return response.data
}

export const updateLink = async (id: string, linkData: any) => {
  const response = await api.put(`/links/${id}`, linkData)
  return response.data
}

export const deleteLink = async (id: string) => {
  const response = await api.delete(`/links/${id}`)
  return response.data
}

export const reorderLinks = async (linkOrder: string[]) => {
  const response = await api.put("/links/reorder", { linkOrder })
  return response.data
}

export const registerLinkClick = async (linkId: string) => {
  const response = await api.get(`/links/click/${linkId}`)
  return response.data
}

// Funções de gerenciamento de perfil
export const getMyProfile = async () => {
  const response = await api.get("/profile/me")
  return response.data
}

export const updateProfile = async (profileData: any) => {
  const response = await api.put("/profile/me", profileData)
  return response.data
}

export const getPublicProfile = async (username: string) => {
  const response = await api.get(`/profile/u/${username}`)
  return response.data
}

// Funções de estatísticas
export const getUserStats = async () => {
  const response = await api.get("/stats")
  return response.data
}

export const getLinkStats = async (linkId: string) => {
  const response = await api.get(`/stats/link/${linkId}`)
  return response.data
}

export default api
