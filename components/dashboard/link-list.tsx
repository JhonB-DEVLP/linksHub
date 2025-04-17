"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LinkForm } from "@/components/dashboard/link-form"
import { Edit, ExternalLink, GripVertical, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Dados de exemplo
const allLinks = [
  {
    id: "1",
    title: "Meu Website",
    url: "https://meusite.com",
    description: "Meu site pessoal com portfolio e blog",
    category: "projects",
    clicks: 123,
    createdAt: "2023-05-01",
  },
  {
    id: "2",
    title: "GitHub",
    url: "https://github.com/username",
    description: "Meus projetos open-source",
    category: "social",
    clicks: 89,
    createdAt: "2023-05-05",
  },
  {
    id: "3",
    title: "LinkedIn",
    url: "https://linkedin.com/in/username",
    description: "Meu perfil profissional",
    category: "social",
    clicks: 67,
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    title: "Twitter",
    url: "https://twitter.com/username",
    description: "Minhas atualizações e pensamentos",
    category: "social",
    clicks: 45,
    createdAt: "2023-05-15",
  },
  {
    id: "5",
    title: "Projeto Open Source",
    url: "https://github.com/username/project",
    description: "Meu projeto open source principal",
    category: "projects",
    clicks: 34,
    createdAt: "2023-05-20",
  },
]

interface LinkListProps {
  category?: string
}

// Componente de item arrastável
function SortableLink({
  link,
  onEdit,
  onDelete,
}: {
  link: any
  onEdit: (link: any) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "social":
        return <Badge variant="secondary">Redes Sociais</Badge>
      case "projects":
        return <Badge variant="default">Projetos</Badge>
      default:
        return <Badge variant="outline">Outros</Badge>
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative">
        <CardHeader className="pb-2">
          <div
            className="absolute left-2 top-3 cursor-move opacity-50 hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="ml-6 flex items-center justify-between">
            <CardTitle className="text-lg">{link.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(link)} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Abrir
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(link.id)}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="truncate">{link.url}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{link.description || "Sem descrição"}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-2">
          {getCategoryBadge(link.category)}
          <span className="text-xs text-muted-foreground">{link.clicks} cliques</span>
        </CardFooter>
      </Card>
    </div>
  )
}

export function LinkList({ category }: LinkListProps) {
  const [links, setLinks] = useState(allLinks)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredLinks = category ? links.filter((link) => link.category === category) : links

  // Configuração dos sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        toast({
          title: "Links reordenados",
          description: "A ordem dos links foi atualizada com sucesso.",
        })

        return newItems
      })
    }
  }

  const handleDelete = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Link excluído com sucesso!",
      description: "O link foi removido da sua lista.",
    })
  }

  const handleConfirmDelete = () => {
    if (linkToDelete) {
      handleDelete(linkToDelete)
    }
  }

  const handleEditLink = (link: any) => {
    setEditingLink(link)
  }

  const handleDeleteLink = (id: string) => {
    setLinkToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  if (filteredLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">Nenhum link encontrado</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          {category ? "Você não tem links nesta categoria." : "Você ainda não adicionou nenhum link."}
        </p>
        <Button>Adicionar Link</Button>
      </div>
    )
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredLinks.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <SortableLink key={link.id} link={link} onEdit={handleEditLink} onDelete={handleDeleteLink} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Dialog de edição */}
      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Link</DialogTitle>
            <DialogDescription>Faça as alterações necessárias no seu link.</DialogDescription>
          </DialogHeader>
          {editingLink && <LinkForm editLink={editingLink} onCancel={() => setEditingLink(null)} />}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
