"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import type { ProfileFormData } from "@/types"

const THEME_OPTIONS = [
  { value: "default", label: "Padrão" },
  { value: "dark", label: "Escuro" },
  { value: "light", label: "Claro" },
  { value: "purple", label: "Roxo" },
  { value: "green", label: "Verde" },
  { value: "blue", label: "Azul" },
  { value: "red", label: "Vermelho" },
]

const BACKGROUND_OPTIONS = [
  { value: "gradient", label: "Gradiente" },
  { value: "solid", label: "Sólido" },
  { value: "pattern", label: "Padrão" },
  { value: "image", label: "Imagem" },
]

export function ProfileForm() {
  const { profile, loading, updateUserProfile } = useProfile()
  const [formData, setFormData] = useState<ProfileFormData>({
    title: "",
    bio: "",
    avatar: "",
    theme: "default",
    background: "gradient",
    showAvatar: true,
    roundedCorners: true,
    darkMode: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preencher o formulário com os dados do perfil quando disponíveis
  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title,
        bio: profile.bio,
        avatar: profile.avatar,
        theme: profile.theme,
        background: profile.background,
        showAvatar: profile.showAvatar,
        roundedCorners: profile.roundedCorners,
        darkMode: profile.darkMode,
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateUserProfile(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Perfil</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Seu nome ou título"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Uma breve descrição sobre você"
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar">URL da Imagem de Perfil</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/sua-imagem.jpg"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Avatar" />
                  <AvatarFallback>{formData.title ? formData.title.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={formData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="background">Fundo</Label>
                  <Select
                    value={formData.background}
                    onValueChange={(value) => handleSelectChange("background", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fundo" />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUND_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showAvatar"
                    checked={formData.showAvatar}
                    onCheckedChange={(checked) => handleSwitchChange("showAvatar", checked)}
                  />
                  <Label htmlFor="showAvatar">Mostrar avatar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="roundedCorners"
                    checked={formData.roundedCorners}
                    onCheckedChange={(checked) => handleSwitchChange("roundedCorners", checked)}
                  />
                  <Label htmlFor="roundedCorners">Cantos arredondados</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={formData.darkMode}
                    onCheckedChange={(checked) => handleSwitchChange("darkMode", checked)}
                  />
                  <Label htmlFor="darkMode">Modo escuro</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
