"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkList } from "@/components/dashboard/link-list"
import { LinkForm } from "@/components/dashboard/link-form"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LinksPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleAddLink = () => {
    setShowForm(true)
    toast({
      title: "Adicione um novo link",
      description: "Preencha os campos para adicionar um link à sua página.",
    })
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Links</h2>
        <Button onClick={handleAddLink} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Adicionar Link</span>
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Link</CardTitle>
            <CardDescription>Preencha os campos abaixo para adicionar um novo link</CardDescription>
          </CardHeader>
          <CardContent>
            <LinkForm onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="other">Outros</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Input
              placeholder="Buscar links..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
        <TabsContent value="all">
          <LinkList />
        </TabsContent>
        <TabsContent value="social">
          <LinkList category="social" />
        </TabsContent>
        <TabsContent value="projects">
          <LinkList category="projects" />
        </TabsContent>
        <TabsContent value="other">
          <LinkList category="other" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
