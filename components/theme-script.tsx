"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // Verifica se o tema está armazenado no localStorage
    const storedTheme = localStorage.getItem("linkhub-theme")

    // Verifica a preferência do sistema
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Aplica o tema baseado na preferência armazenada ou do sistema
    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return null
}
