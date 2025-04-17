"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface BackgroundSelectorProps {
  value: string
  onChange: (value: string) => void
}

const backgrounds = [
  {
    id: "solid",
    name: "Sólido",
    description: "Cor de fundo sólida",
  },
  {
    id: "gradient",
    name: "Gradiente",
    description: "Gradiente suave",
  },
  {
    id: "pattern",
    name: "Padrão",
    description: "Padrão de fundo sutil",
  },
  {
    id: "image",
    name: "Imagem",
    description: "Imagem de fundo personalizada",
  },
]

export function BackgroundSelector({ value, onChange }: BackgroundSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {backgrounds.map((background) => (
        <div
          key={background.id}
          className={cn(
            "flex cursor-pointer flex-col items-center rounded-lg border p-4 hover:border-primary",
            value === background.id ? "border-primary bg-primary/5" : "border-border",
          )}
          onClick={() => onChange(background.id)}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {value === background.id ? <Check className="h-5 w-5 text-primary" /> : null}
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium">{background.name}</h4>
            <p className="text-xs text-muted-foreground">{background.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
