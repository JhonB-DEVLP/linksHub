"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ProfilePreview } from "@/components/dashboard/profile-preview"
import { ThemeSelector } from "@/components/dashboard/theme-selector"
import { BackgroundSelector } from "@/components/dashboard/background-selector"

export default function AppearancePage() {
  const [profile, setProfile] = useState({
    title: "João Silva",
    bio: "Desenvolvedor Full Stack | React, Node.js, Next.js | Apaixonado por criar experiências digitais incríveis",
    avatar: "/mystical-forest-spirit.png",
    theme: "default",
    background: "gradient",
    showAvatar: true,
    roundedCorners: true,
    darkMode: false,
  })

  const { toast } = useToast()

  const handleChange = (field: string, value: any) => {
    setProfile({
      ...profile,
      [field]: value,
    })
  }

  const handleSave = () => {
    toast({
      title: "Alterações salvas com sucesso!",
      description: "Sua página foi atualizada.",
    })
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Aparência</h2>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="theme">Tema</TabsTrigger>
              <TabsTrigger value="background">Plano de Fundo</TabsTrigger>
              <TabsTrigger value="fonts">Fontes</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Personalize as informações exibidas na sua página</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={profile.title} onChange={(e) => handleChange("title", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">URL do Avatar</Label>
                    <Input
                      id="avatar"
                      value={profile.avatar}
                      onChange={(e) => handleChange("avatar", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-avatar"
                      checked={profile.showAvatar}
                      onCheckedChange={(checked) => handleChange("showAvatar", checked)}
                    />
                    <Label htmlFor="show-avatar">Exibir Avatar</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tema</CardTitle>
                  <CardDescription>Escolha um tema para sua página</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSelector value={profile.theme} onChange={(value) => handleChange("theme", value)} />
                  <div className="mt-4 flex items-center space-x-2">
                    <Switch
                      id="rounded-corners"
                      checked={profile.roundedCorners}
                      onCheckedChange={(checked) => handleChange("roundedCorners", checked)}
                    />
                    <Label htmlFor="rounded-corners">Cantos Arredondados</Label>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Switch
                      id="dark-mode"
                      checked={profile.darkMode}
                      onCheckedChange={(checked) => handleChange("darkMode", checked)}
                    />
                    <Label htmlFor="dark-mode">Modo Escuro para Visitantes</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="background" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Plano de Fundo</CardTitle>
                  <CardDescription>Personalize o plano de fundo da sua página</CardDescription>
                </CardHeader>
                <CardContent>
                  <BackgroundSelector
                    value={profile.background}
                    onChange={(value) => handleChange("background", value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fontes</CardTitle>
                  <CardDescription>Personalize as fontes da sua página</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Opções de personalização de fontes serão adicionadas em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pré-visualização</h3>
          <ProfilePreview profile={profile} />
        </div>
      </div>
    </div>
  )
}
