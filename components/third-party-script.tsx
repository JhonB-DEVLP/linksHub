"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface ThirdPartyScriptProps {
  src: string
  id: string
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
  onLoad?: () => void
}

export function ThirdPartyScript({ src, id, strategy = "lazyOnload", onLoad }: ThirdPartyScriptProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Carregar o script apenas após a interação do usuário
    const handleUserInteraction = () => {
      setShouldLoad(true)

      // Remover os event listeners após a primeira interação
      window.removeEventListener("scroll", handleUserInteraction)
      window.removeEventListener("mousemove", handleUserInteraction)
      window.removeEventListener("touchstart", handleUserInteraction)
    }

    // Se a estratégia for lazyOnload, esperar pela interação do usuário
    if (strategy === "lazyOnload") {
      window.addEventListener("scroll", handleUserInteraction, { passive: true })
      window.addEventListener("mousemove", handleUserInteraction, { passive: true })
      window.addEventListener("touchstart", handleUserInteraction, { passive: true })

      // Definir um timeout para carregar o script mesmo sem interação
      const timeoutId = setTimeout(() => {
        setShouldLoad(true)
      }, 5000)

      return () => {
        window.removeEventListener("scroll", handleUserInteraction)
        window.removeEventListener("mousemove", handleUserInteraction)
        window.removeEventListener("touchstart", handleUserInteraction)
        clearTimeout(timeoutId)
      }
    } else {
      // Para outras estratégias, carregar imediatamente
      setShouldLoad(true)
    }
  }, [strategy])

  if (!shouldLoad && strategy === "lazyOnload") {
    return null
  }

  return <Script src={src} id={id} strategy={strategy} onLoad={onLoad} />
}
