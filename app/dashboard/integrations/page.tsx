"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Music, Video, ShoppingBag, Calendar, Mail, MessageSquare, Rss, Globe, PlusCircle, Check } from "lucide-react"
import { TwitterIcon, InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/dashboard/social-icons"

// Dados de exemplo
const socialIntegrations = [
  {
    id: "twitter",
    name: "Twitter",
    description: "Conecte sua conta do Twitter para compartilhar atualizações.",
    icon: <TwitterIcon className="h-6 w-6" />,
    connected: true,
    status: "active",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Conecte sua conta do Instagram para exibir suas fotos mais recentes.",
    icon: <InstagramIcon className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Conecte sua conta do LinkedIn para compartilhar seu perfil profissional.",
    icon: <LinkedinIcon className="h-6 w-6" />,
    connected: true,
    status: "active",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Conecte sua conta do GitHub para exibir seus repositórios.",
    icon: <GithubIcon className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
]

const contentIntegrations = [
  {
    id: "spotify",
    name: "Spotify",
    description: "Exiba suas músicas e playlists favoritas do Spotify.",
    icon: <Music className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Exiba seus vídeos e canal do YouTube.",
    icon: <Video className="h-6 w-6" />,
    connected: true,
    status: "active",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Exiba seus artigos mais recentes do Medium.",
    icon: <Rss className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Conecte sua loja Shopify para exibir produtos.",
    icon: <ShoppingBag className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
]

const toolIntegrations = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Permita que visitantes agendem reuniões diretamente em seu calendário.",
    icon: <Calendar className="h-6 w-6" />,
    connected: true,
    status: "active",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Adicione um formulário de inscrição para sua newsletter.",
    icon: <Mail className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Adicione um convite para seu servidor Discord.",
    icon: <MessageSquare className="h-6 w-6" />,
    connected: false,
    status: "inactive",
  },
  {
    id: "custom-domain",
    name: "Domínio Personalizado",
    description: "Conecte seu próprio domínio à sua página de links.",
    icon: <Globe className="h-6 w-6" />,
    connected: false,
    status: "inactive",
    premium: true,
  },
]

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("social")
  const { toast } = useToast()

  const handleConnect = (id: string) => {
    toast({
      title: "Conectando integração",
      description: "Redirecionando para a página de autorização...",
    })
  }

  const handleDisconnect = (id: string) => {
    toast({
      title: "Integração desconectada",
      description: "A integração foi desconectada com sucesso.",
    })
  }

  const handleToggle = (id: string, checked: boolean) => {
    toast({
      title: checked ? "Integração ativada" : "Integração desativada",
      description: checked ? "A integração foi ativada com sucesso." : "A integração foi desativada com sucesso.",
    })
  }

  const renderIntegrationCard = (integration: any) => (
    <Card key={integration.id} className={integration.premium ? "border-primary/20" : ""}>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{integration.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{integration.name}</CardTitle>
            {integration.premium && <Badge variant="outline">Premium</Badge>}
          </div>
          <CardDescription>{integration.description}</CardDescription>
        </div>
        {integration.connected && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Check className="h-3 w-3" /> Conectado
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {integration.connected && (
          <div className="flex items-center space-x-2">
            <Switch
              id={`${integration.id}-toggle`}
              checked={integration.status === "active"}
              onCheckedChange={(checked) => handleToggle(integration.id, checked)}
            />
            <Label htmlFor={`${integration.id}-toggle`}>{integration.status === "active" ? "Ativo" : "Inativo"}</Label>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {integration.connected ? (
          <Button variant="outline" onClick={() => handleDisconnect(integration.id)}>
            Desconectar
          </Button>
        ) : (
          <Button onClick={() => handleConnect(integration.id)} disabled={integration.premium}>
            {integration.premium ? "Requer plano Premium" : "Conectar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Integrações</h2>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Solicitar Integração</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">{socialIntegrations.map(renderIntegrationCard)}</div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">{contentIntegrations.map(renderIntegrationCard)}</div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">{toolIntegrations.map(renderIntegrationCard)}</div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>API Personalizada</CardTitle>
          <CardDescription>Conecte sua própria API para integração personalizada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">URL da API</Label>
            <Input id="api-url" placeholder="https://api.seuservico.com/endpoint" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave da API</Label>
            <Input id="api-key" type="password" placeholder="Sua chave de API secreta" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Conectar API</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
