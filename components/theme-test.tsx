"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ThemeTest() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Teste de Tema</CardTitle>
        <CardDescription>Verifique se o modo escuro está funcionando corretamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Tema atual:</p>
            <p className="text-sm text-muted-foreground">{theme || "não definido"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Tema resolvido:</p>
            <p className="text-sm text-muted-foreground">{resolvedTheme || "não definido"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Tema do sistema:</p>
            <p className="text-sm text-muted-foreground">{systemTheme || "não definido"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Classe dark:</p>
            <p className="text-sm text-muted-foreground">
              {document.documentElement.classList.contains("dark") ? "presente" : "ausente"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTheme("light")}>Tema Claro</Button>
          <Button onClick={() => setTheme("dark")}>Tema Escuro</Button>
          <Button onClick={() => setTheme("system")}>Tema do Sistema</Button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              document.documentElement.classList.add("dark")
            }}
          >
            Adicionar classe dark
          </Button>
          <Button
            onClick={() => {
              document.documentElement.classList.remove("dark")
            }}
          >
            Remover classe dark
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
