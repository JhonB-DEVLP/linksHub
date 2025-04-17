"use client"

import type React from "react"

import { useState } from "react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, GripVertical, ExternalLink, Eye, EyeOff } from "lucide-react"
import { LinkForm } from "./link-form"
import type { Link } from "@/types"

export function LinkList() {
  const { links, loading, removeLink, reorderLinkItems, editLink } = useLinks()
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Link | null>(null)

  // Função para lidar com o início do arrasto
  const handleDragStart = (e: React.DragEvent, link: Link) => {
    setIsDragging(true)
    setDraggedItem(link)
    // Definir a imagem de arrasto como transparente
    const img = new Image()
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    e.dataTransfer.setDragImage(img, 0, 0)
  }

  // Função para lidar com o fim do arrasto
  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedItem(null)
  }

  // Função para lidar com o arrasto sobre outro item
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Função para lidar com a soltura do item
  const handleDrop = (e: React.DragEvent, targetLink: Link) => {
    e.preventDefault()
    if (!draggedItem) return

    const newLinks = [...links]
    const draggedIndex = newLinks.findIndex((link) => link.id === draggedItem.id)
    const targetIndex = newLinks.findIndex((link) => link.id === targetLink.id)

    if (draggedIndex === targetIndex) return

    // Reordenar os links
    const linkOrder = newLinks.map((link) => link.id)
    const [removed] = linkOrder.splice(draggedIndex, 1)
    linkOrder.splice(targetIndex, 0, removed)

    // Atualizar no servidor
    reorderLinkItems(linkOrder)
  }

  // Função para alternar a visibilidade de um link
  const toggleLinkVisibility = async (link: Link) => {
    await editLink(link.id, { active: !link.active })
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
          {links.map((link) => (
            <Card
              key={link.id}
              className={`${isDragging && draggedItem?.id === link.id ? "opacity-50" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, link)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, link)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="cursor-move">
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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Excluir link">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir link</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o link "{link.title}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeLink(link.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

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
          ))}
        </div>
      )}

      {/* Modal para adicionar link */}
      {isAddingLink && <LinkForm onClose={() => setIsAddingLink(false)} isOpen={isAddingLink} />}

      {/* Modal para editar link */}
      {editingLink && <LinkForm onClose={() => setEditingLink(null)} isOpen={!!editingLink} link={editingLink} />}
    </div>
  )
}
