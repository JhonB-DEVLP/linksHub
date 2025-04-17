// Tipos para autenticação
export interface User {
  id: string
  name: string
  email: string
  username: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Tipos para links
export interface Link {
  id: string
  title: string
  url: string
  description: string
  category: string
  icon: string
  position: number
  active: boolean
  clicks: number
  createdAt: string
  updatedAt: string
  userId: string
}

// Tipos para perfil
export interface Profile {
  id: string
  title: string
  bio: string
  avatar: string
  theme: string
  background: string
  showAvatar: boolean
  roundedCorners: boolean
  darkMode: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

// Tipos para estatísticas
export interface DailyStats {
  date: string
  count: number
}

export interface ReferrerStats {
  referrer: string
  count: number
}

export interface DeviceStats {
  device: string
  count: number
}

export interface UserStats {
  totalLinks: number
  totalClicks: number
  profileViews: number
  topLinks: Link[]
  clicksByDay: DailyStats[]
  viewsByDay: DailyStats[]
}

export interface LinkStats {
  linkInfo: Link
  totalClicks: number
  clicksByDay: DailyStats[]
  clicksByReferrer: ReferrerStats[]
  clicksByDevice: DeviceStats[]
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  count?: number
}

// Tipos para formulários
export interface LinkFormData {
  title: string
  url: string
  description: string
  category: string
  icon: string
  active: boolean
}

export interface ProfileFormData {
  title: string
  bio: string
  avatar: string
  theme: string
  background: string
  showAvatar: boolean
  roundedCorners: boolean
  darkMode: boolean
}

// Tipos para perfil público
export interface PublicProfile {
  user: {
    name: string
    username: string
  }
  profile: Profile | null
  links: Link[]
}
