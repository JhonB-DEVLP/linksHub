"use client"

import { cn } from "@/lib/utils"
import { Check, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeSelectorProps {
  value: string
  onChange: (value: string) => void
}

const themes = [
  {
    id: "default",
    name: "Padrão",
    description: "Tema padrão com design limpo",
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Design minimalista e elegante",
    icon: <Moon className="h-5 w-5" />,
  },
  {
    id: "colorful",
    name: "Colorido",
    description: "Design colorido e vibrante",
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    id: "modern",
    name: "Moderno",
    description: "Design moderno com bordas suaves",
    icon: <Check className="h-5 w-5" />,
  },
]

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-medium">Modo de Cor</h3>
        <div className="grid grid-cols-3 gap-4">
          <div
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary",
              "light" === "light" ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => setTheme("light")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sun className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium">Claro</h4>
            </div>
          </div>
          <div
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary",
              "dark" === "dark" ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => setTheme("dark")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium">Escuro</h4>
            </div>
          </div>
          <div
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary",
              "system" === "system" ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => setTheme("system")}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium">Sistema</h4>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-medium">Estilo do Tema</h3>
      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={cn(
              "flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary",
              value === theme.id ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => onChange(theme.id)}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {value === theme.id ? <Check className="h-5 w-5 text-primary" /> : theme.icon}
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium">{theme.name}</h4>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
