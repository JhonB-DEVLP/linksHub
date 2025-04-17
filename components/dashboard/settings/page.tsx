"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const SettingsPage = () => {
  const toggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("linkhub-theme", "light")
    } else {
      html.classList.add("dark")
      localStorage.setItem("linkhub-theme", "dark")
    }
    toast({
      title: "Modo escuro alterado",
      description: "A aparência foi atualizada.",
    })
  }

  return (
    <div>
      <h1>Configurações</h1>
      <Button onClick={toggleDarkMode} className="mt-4">
        Alternar Modo Escuro (Teste)
      </Button>
    </div>
  )
}

export default SettingsPage
