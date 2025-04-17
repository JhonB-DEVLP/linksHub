"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProfileForm } from "@/components/profile/profile-form"

export default function ProfilePage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Configurações de Perfil</h1>

      <div className="max-w-3xl mx-auto">
        <ProfileForm />

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-medium mb-2">Seu link público</h2>
          <div className="flex items-center">
            <code className="bg-background p-2 rounded flex-1 overflow-x-auto">
              {`${window.location.origin}/u/${user?.username}`}
            </code>
            <button
              className="ml-2 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${user?.username}`)
              }}
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
