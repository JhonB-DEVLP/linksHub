"use client"

import { useState, useEffect, useCallback } from "react"
import { getMyProfile, updateProfile } from "@/lib/api"
import type { Profile, ProfileFormData } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar perfil do usuário
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getMyProfile()
      if (response.success) {
        setProfile(response.data)
        setError(null)
      } else {
        setError(response.error || "Erro ao buscar perfil")
      }
    } catch (err) {
      setError("Erro ao buscar perfil")
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar perfil
  const updateUserProfile = useCallback(async (profileData: Partial<ProfileFormData>) => {
    try {
      setLoading(true)
      const response = await updateProfile(profileData)
      if (response.success) {
        setProfile(response.data)
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        })
        return response.data
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar perfil",
          variant: "destructive",
        })
        return null
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar perfil ao montar o componente
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateUserProfile,
  }
}
