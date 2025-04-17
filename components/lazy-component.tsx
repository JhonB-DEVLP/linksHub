"use client"

import type React from "react"

import { useState, useEffect, type ComponentType } from "react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback: React.ReactNode
  props?: Record<string, any>
}

export function LazyComponent({ component, fallback, props = {} }: LazyComponentProps) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadComponent = async () => {
      try {
        const module = await component()
        if (isMounted) {
          setComponent(() => module.default)
        }
      } catch (error) {
        console.error("Failed to load component:", error)
      }
    }

    loadComponent()

    return () => {
      isMounted = false
    }
  }, [component])

  if (!Component) {
    return <>{fallback}</>
  }

  return <Component {...props} />
}
