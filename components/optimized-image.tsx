"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, className = "", priority = false }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    // Usar Intersection Observer para carregar a imagem apenas quando estiver visível
    if (!priority && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
              observer.disconnect()
            }
          })
        },
        { rootMargin: "200px" }, // Pré-carrega quando estiver a 200px de distância
      )

      const currentElement = document.getElementById(`image-${src.replace(/\W/g, "")}`)
      if (currentElement) {
        observer.observe(currentElement)
      }

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement)
        }
      }
    } else {
      setIsInView(true)
    }
  }, [src, priority])

  return (
    <div
      id={`image-${src.replace(/\W/g, "")}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {(isInView || priority) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
        />
      )}
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ width, height }} />}
    </div>
  )
}
