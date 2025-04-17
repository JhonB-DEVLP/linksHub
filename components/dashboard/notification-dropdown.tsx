"use client"

import { useState } from "react"
import { Bell, Check, Clock, ExternalLink, Info, MessageSquare, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Tipos para as notificações
interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "message" | "user"
  link?: string
}

// Dados de exemplo para notificações
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Novo seguidor",
    message: "Maria começou a seguir você",
    time: "Agora mesmo",
    read: false,
    type: "user",
    link: "/dashboard/analytics",
  },
  {
    id: "2",
    title: "Link popular",
    message: "Seu link 'GitHub' recebeu 50 cliques hoje",
    time: "2 horas atrás",
    read: false,
    type: "success",
    link: "/dashboard/analytics",
  },
  {
    id: "3",
    title: "Atualização do sistema",
    message: "Novos recursos foram adicionados ao LinkHub",
    time: "1 dia atrás",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Lembrete",
    message: "Atualize seu perfil para melhorar sua visibilidade",
    time: "3 dias atrás",
    read: true,
    type: "warning",
  },
  {
    id: "5",
    title: "Mensagem",
    message: "Você recebeu uma nova mensagem de João",
    time: "1 semana atrás",
    read: true,
    type: "message",
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Suas notificações foram atualizadas.",
    })
    setOpen(false)
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-violet-500" />
      case "user":
        return <User className="h-4 w-4 text-indigo-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
        ) : (
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-start p-4 text-left",
                    !notification.read && "bg-muted/50",
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    if (notification.link) {
                      // Em uma aplicação real, você usaria router.push aqui
                      window.location.href = notification.link
                    }
                  }}
                >
                  <div className="flex w-full items-start gap-2">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm font-medium", !notification.read && "text-foreground")}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
                      {notification.link && (
                        <div className="mt-1 flex items-center text-xs text-primary">
                          <span>Ver detalhes</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <a href="/dashboard/settings" className="flex w-full items-center justify-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações de notificação</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
