"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LinkStats } from "@/components/stats/link-stats"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface LinkStatsPageProps {
  params: {
    id: string
  }
}

export default function LinkStatsPage({ params }: LinkStatsPageProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const linkId = params.id

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
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <LinkStats linkId={linkId} />
      </div>
    </div>
  )
}
