"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo
const links = [
  {
    id: "1",
    title: "Meu Website",
    url: "https://meusite.com",
    category: "projects",
    views: 1245,
    clicks: 823,
    ctr: 66.1,
    createdAt: "2023-05-01",
  },
  {
    id: "2",
    title: "GitHub",
    url: "https://github.com/username",
    category: "social",
    views: 987,
    clicks: 542,
    ctr: 54.9,
    createdAt: "2023-05-05",
  },
  {
    id: "3",
    title: "LinkedIn",
    url: "https://linkedin.com/in/username",
    category: "social",
    views: 876,
    clicks: 421,
    ctr: 48.1,
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    title: "Twitter",
    url: "https://twitter.com/username",
    category: "social",
    views: 765,
    clicks: 312,
    ctr: 40.8,
    createdAt: "2023-05-15",
  },
  {
    id: "5",
    title: "Projeto Open Source",
    url: "https://github.com/username/project",
    category: "projects",
    views: 654,
    clicks: 247,
    ctr: 37.8,
    createdAt: "2023-05-20",
  },
]

export function AnalyticsTable() {
  const [sortBy, setSortBy] = useState<string>("views")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const sortedLinks = [...links].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a]
    const bValue = b[sortBy as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Link</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("views")}>
                Visualizações
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("clicks")}>
                Cliques
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("ctr")}>
                CTR (%)
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLinks.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{link.title}</div>
                  <div className="text-xs text-muted-foreground">{link.url}</div>
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(link.category)}</TableCell>
              <TableCell>{link.views.toLocaleString()}</TableCell>
              <TableCell>{link.clicks.toLocaleString()}</TableCell>
              <TableCell>{link.ctr.toFixed(1)}%</TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuItem asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" /> Abrir Link
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Exportar Dados</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
