"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Github, Globe, Instagram, Linkedin, Twitter, Youtube, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"

interface Link {
  id: string
  title: string
  url: string
  icon: string
}

interface UserLinksProps {
  links: Link[]
}

export function UserLinks({ links }: UserLinksProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Evita erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return <Github className="h-5 w-5" />
      case "Twitter":
        return <Twitter className="h-5 w-5" />
      case "Linkedin":
        return <Linkedin className="h-5 w-5" />
      case "Instagram":
        return <Instagram className="h-5 w-5" />
      case "Youtube":
        return <Youtube className="h-5 w-5" />
      case "Globe":
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const handleLinkClick = (url: string) => {
    // Aqui poderia ter lógica para registrar o clique
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid w-full gap-4">
      {links.map((link) => (
        <Button
          key={link.id}
          variant="outline"
          className="flex w-full items-center justify-between py-6 text-base hover:bg-primary/5 dark:hover:bg-primary/10"
          onClick={() => handleLinkClick(link.url)}
        >
          <div className="flex items-center">
            {getIcon(link.icon)}
            <span className="ml-2">{link.title}</span>
          </div>
          <ExternalLink className="h-4 w-4 opacity-50" />
        </Button>
      ))}
    </div>
  )
}
