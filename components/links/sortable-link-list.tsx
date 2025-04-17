"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useLinks } from "@/hooks/use-links"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, GripVertical, ExternalLink, Eye, EyeOff } from "lucide-react"
import { LinkForm } from "./link-form"
import type { Link } from "@/types"

export function SortableLinkList() {
  const { links, loading, removeLink, reorderLinkItems, editLink } = useLinks()
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [draggedItem, setDraggedItem] = useState<Link | null>(null)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Referência para o elemento sendo arrastado
  const draggedRef = useRef<HTMLDivElement | null>(null)

  // Estado para armazenar a posição inicial do mouse durante o arrasto
  const [dragStartY, setDragStartY] = useState(0)

  // Estado para armazenar a ordem atual dos links durante o arrasto
  const [currentOrder, setCurrentOrder] = useState<Link[]>([])

  // Função para lidar com o início do arrasto
  const handleDragStart = (e: React.DragEvent, link: Link, index: number) => {
    // Prevenir comportamento padrão para alguns navegadores
    e.dataTransfer.effectAllowed = "move"

    // Definir uma imagem de arrasto transparente
    const img = new Image()
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    e.dataTransfer.setDragImage(img, 0, 0)

    // Armazenar o item sendo arrastado
    setDraggedItem(link)

    // Armazenar a posição inicial do mouse
    setDragStartY(e.clientY)

    // Armazenar a ordem atual dos links
    setCurrentOrder([...links])

    // Armazenar a referência do elemento
    draggedRef.current = e.currentTarget as HTMLDivElement

    // Adicionar classe de arrasto
    e.currentTarget.classList.add("opacity-50", "border-primary")
  }

  // Função para lidar com o arrasto sobre outro item
  const handleDragOver = (e: React.DragEvent, link: Link) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === link.id) return

    // Calcular a direção do arrasto
    const draggedIndex = currentOrder.findIndex((item) => item.id === draggedItem.id)
    const targetIndex = currentOrder.findIndex((item) => item.id === link.id)

    if (draggedIndex === targetIndex) return

    // Criar uma nova ordem movendo o item arrastado
    const newOrder = [...currentOrder]
    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, removed)

    // Atualizar a ordem atual
    setCurrentOrder(newOrder)
  }

  // Função para lidar com o fim do arrasto
  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()

    // Remover classe de arrasto
    if (draggedRef.current) {
      draggedRef.current.classList.remove("opacity-50", "border-primary")
      draggedRef.current = null
    }

    if (!draggedItem) return

    // Verificar se a ordem mudou
    const originalOrder = links.map((link) => link.id)
    const newOrder = currentOrder.map((link) => link.id)

    // Verificar se as ordens são diferentes
    const orderChanged = originalOrder.some((id, index) => id !== newOrder[index])

    if (orderChanged) {
      // Atualizar a ordem no servidor
      reorderLinkItems(newOrder)
    }

    // Limpar estados
    setDraggedItem(null)
    setDragStartY(0)
  }

  // Função para alternar a visibilidade de um link
  const toggleLinkVisibility = async (link: Link) => {
    await editLink(link.id, { active: !link.active })
  }

  // Função para confirmar a exclusão de um link
  const confirmDelete = (linkId: string) => {
    setLinkToDelete(linkId)
    setIsDeleteDialogOpen(true)
  }

  // Função para excluir um link após confirmação
  const handleDelete = async () => {
    if (linkToDelete) {
      await removeLink(linkToDelete)
      setLinkToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  if (loading && links.length === 0) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seus Links</h2>
        <Button onClick={() => setIsAddingLink(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Link
        </Button>
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Você ainda não tem links. Adicione seu primeiro link!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(currentOrder.length > 0 && draggedItem ? currentOrder : links).map((link, index) => (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, link, index)}
              onDragOver={(e) => handleDragOver(e, link)}
              onDragEnd={handleDragEnd}
              className="transition-all duration-200 border rounded-md"
            >
              <Card className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="cursor-move touch-none">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{link.title}</h3>
                        {!link.active && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Inativo</span>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLinkVisibility(link)}
                        title={link.active ? "Desativar link" : "Ativar link"}
                      >
                        {link.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => setEditingLink(link)} title="Editar link">
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(link.id)} title="Excluir link">
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(link.url, "_blank")}
                        title="Abrir link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal para adicionar link */}
      {isAddingLink && <LinkForm onClose={() => setIsAddingLink(false)} isOpen={isAddingLink} />}

      {/* Modal para editar link */}
      {editingLink && <LinkForm onClose={() => setEditingLink(null)} isOpen={!!editingLink} link={editingLink} />}

      {/* Diálogo de confirmação para excluir link */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir link</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
