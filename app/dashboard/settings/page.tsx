"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Check, Copy, Globe, Lock, Mail, User, UserCog, MousePointerClick } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      })
    }, 1000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://linkhub.com/u/username")
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    })
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/mystical-forest-spirit.png" alt="@username" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" placeholder="Seu nome" defaultValue="João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input id="username" placeholder="Seu nome de usuário" defaultValue="joaosilva" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você"
                      defaultValue="Desenvolvedor Full Stack | React, Node.js, Next.js | Apaixonado por criar experiências digitais incríveis"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Seu Link Público</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" value="https://linkhub.com/u/joaosilva" readOnly />
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar link</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Adicione links para suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="@username" defaultValue="@joaosilva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="@username" defaultValue="@joaosilva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="URL do perfil" defaultValue="https://linkedin.com/in/joaosilva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" placeholder="Nome de usuário" defaultValue="joaosilva" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Atualize suas informações de conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao.silva@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Alterar Senha</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano</CardTitle>
              <CardDescription>Seu plano atual e informações de assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Plano Gratuito</h3>
                    <p className="text-sm text-muted-foreground">Recursos básicos para começar</p>
                  </div>
                  <Button variant="outline">Fazer Upgrade</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis para sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Excluir sua conta é uma ação permanente e não pode ser desfeita. Todos os seus dados serão perdidos.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Excluir Conta</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>Personalize a aparência do seu dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div
                  className="flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => {
                      document.documentElement.classList.remove("dark")
                      localStorage.setItem("linkhub-theme", "light")
                      setIsLoading(false)
                      toast({
                        title: "Tema alterado",
                        description: "O tema claro foi aplicado com sucesso.",
                      })
                    }, 500)
                  }}
                >
                  <div className="mb-2 h-20 w-full rounded-md bg-background border"></div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium">Claro</h4>
                  </div>
                </div>
                <div
                  className="flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => {
                      document.documentElement.classList.add("dark")
                      localStorage.setItem("linkhub-theme", "dark")
                      setIsLoading(false)
                      toast({
                        title: "Tema alterado",
                        description: "O tema escuro foi aplicado com sucesso.",
                      })
                    }, 500)
                  }}
                >
                  <div className="mb-2 h-20 w-full rounded-md bg-zinc-900"></div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium">Escuro</h4>
                  </div>
                </div>
                <div
                  className="flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => {
                      localStorage.setItem("linkhub-theme", "system")
                      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                      if (isDarkMode) {
                        document.documentElement.classList.add("dark")
                      } else {
                        document.documentElement.classList.remove("dark")
                      }
                      setIsLoading(false)
                      toast({
                        title: "Tema alterado",
                        description: "O tema do sistema foi aplicado com sucesso.",
                      })
                    }, 500)
                  }}
                >
                  <div className="mb-2 h-20 w-full rounded-md bg-gradient-to-b from-background to-zinc-900"></div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium">Sistema</h4>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Idioma</CardTitle>
              <CardDescription>Escolha o idioma do seu dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select defaultValue="pt-BR">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Escolha como deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <Label htmlFor="new-followers">Novos Seguidores</Label>
                  </div>
                  <Switch id="new-followers" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4" />
                    <Label htmlFor="click-notifications">Relatórios de Cliques</Label>
                  </div>
                  <Switch id="click-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <Label htmlFor="product-updates">Atualizações do Produto</Label>
                  </div>
                  <Switch id="product-updates" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domínio Personalizado</CardTitle>
              <CardDescription>Configure seu próprio domínio para sua página de links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Recurso Premium</AlertTitle>
                <AlertDescription>
                  Domínios personalizados estão disponíveis apenas para usuários do plano Premium.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Domínio Personalizado</Label>
                <Input id="custom-domain" placeholder="seudominio.com" disabled />
              </div>
              <Button disabled>Fazer Upgrade para Adicionar Domínio</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados</CardTitle>
              <CardDescription>Baixe uma cópia dos seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="gap-2">
                  <Check className="h-4 w-4" />
                  <span>Exportar Links</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Check className="h-4 w-4" />
                  <span>Exportar Estatísticas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
