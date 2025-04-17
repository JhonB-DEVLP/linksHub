"use client"

import { useState, useEffect, useCallback } from "react"
import { getUserStats, getLinkStats } from "@/lib/api"
import type { UserStats, LinkStats } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar estatísticas do usuário
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getUserStats()
      if (response.success) {
        setStats(response.data)
        setError(null)
      } else {
        setError(response.error || "Erro ao buscar estatísticas")
      }
    } catch (err) {
      setError("Erro ao buscar estatísticas")
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas estatísticas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}

export function useLinkStats(linkId: string) {
  const [stats, setStats] = useState<LinkStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar estatísticas de um link específico
  const fetchLinkStats = useCallback(async () => {
    if (!linkId) return

    try {
      setLoading(true)
      const response = await getLinkStats(linkId)
      if (response.success) {
        setStats(response.data)
        setError(null)
      } else {
        setError(response.error || "Erro ao buscar estatísticas do link")
      }
    } catch (err) {
      setError("Erro ao buscar estatísticas do link")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas deste link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [linkId])

  // Carregar estatísticas ao montar o componente ou quando o linkId mudar
  useEffect(() => {
    if (linkId) {
      fetchLinkStats()
    }
  }, [linkId, fetchLinkStats])

  return {
    stats,
    loading,
    error,
    fetchLinkStats,
  }
}
