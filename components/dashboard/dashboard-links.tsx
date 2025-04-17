"use client"

import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const links = [
  {
    id: "1",
    title: "Meu Website",
    url: "https://meusite.com",
    clicks: 123,
    createdAt: "2023-05-01",
  },
  {
    id: "2",
    title: "GitHub",
    url: "https://github.com/username",
    clicks: 89,
    createdAt: "2023-05-05",
  },
  {
    id: "3",
    title: "LinkedIn",
    url: "https://linkedin.com/in/username",
    clicks: 67,
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    title: "Twitter",
    url: "https://twitter.com/username",
    clicks: 45,
    createdAt: "2023-05-15",
  },
]

export function DashboardLinks() {
  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div key={link.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex flex-col gap-1">
            <div className="font-medium">{link.title}</div>
            <div className="text-xs text-muted-foreground">{link.url}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{link.clicks} cliques</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Abrir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                  <Trash className="h-4 w-4" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
