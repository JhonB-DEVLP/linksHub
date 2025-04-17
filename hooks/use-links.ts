"use client"

import { useState, useEffect, useCallback } from "react"
import { getLinks, createLink, updateLink, deleteLink, reorderLinks } from "@/lib/api"
import type { Link, LinkFormData } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os links
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getLinks()
      if (response.success) {
        setLinks(response.data)
        setError(null)
      } else {
        setError(response.error || "Erro ao buscar links")
        toast({
          title: "Erro",
          description: response.error || "Erro ao buscar links",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("Erro ao buscar links")
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus links",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar um novo link
  const addLink = useCallback(async (linkData: LinkFormData) => {
    try {
      setLoading(true)
      const response = await createLink(linkData)
      if (response.success) {
        setLinks((prev) => [...prev, response.data])
        toast({
          title: "Sucesso",
          description: "Link adicionado com sucesso",
        })
        return response.data
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao adicionar link",
          variant: "destructive",
        })
        return null
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o link",
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar um link existente
  const editLink = useCallback(async (id: string, linkData: Partial<LinkFormData>) => {
    try {
      setLoading(true)
      const response = await updateLink(id, linkData)
      if (response.success) {
        setLinks((prev) => prev.map((link) => (link.id === id ? response.data : link)))
        toast({
          title: "Sucesso",
          description: "Link atualizado com sucesso",
        })
        return response.data
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar link",
          variant: "destructive",
        })
        return null
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o link",
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Remover um link
  const removeLink = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const response = await deleteLink(id)
      if (response.success) {
        setLinks((prev) => prev.filter((link) => link.id !== id))
        toast({
          title: "Sucesso",
          description: "Link removido com sucesso",
        })
        return true
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao remover link",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o link",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Reordenar links
  const reorderLinkItems = useCallback(
    async (newOrder: string[]) => {
      try {
        setLoading(true)
        // Otimisticamente atualizar a UI
        const reorderedLinks = [...links]
        newOrder.forEach((id, index) => {
          const linkIndex = reorderedLinks.findIndex((link) => link.id === id)
          if (linkIndex !== -1) {
            reorderedLinks[linkIndex] = { ...reorderedLinks[linkIndex], position: index }
          }
        })

        // Ordenar por posição
        reorderedLinks.sort((a, b) => a.position - b.position)
        setLinks(reorderedLinks)

        // Enviar para o servidor
        const response = await reorderLinks(newOrder)
        if (!response.success) {
          // Se falhar, reverter para a ordem anterior
          await fetchLinks()
          toast({
            title: "Erro",
            description: response.error || "Erro ao reordenar links",
            variant: "destructive",
          })
        }
      } catch (err) {
        // Se falhar, reverter para a ordem anterior
        await fetchLinks()
        toast({
          title: "Erro",
          description: "Não foi possível reordenar os links",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [links, fetchLinks],
  )

  // Carregar links ao montar o componente
  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return {
    links,
    loading,
    error,
    fetchLinks,
    addLink,
    editLink,
    removeLink,
    reorderLinkItems,
  }
}
