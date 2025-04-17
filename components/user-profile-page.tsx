"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"

interface UserProfileProps {
  username: string
}

export default function UserProfilePage({ username }: UserProfileProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${username}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile")
        }

        setProfile(data.data.profile)
        setLinks(data.data.links)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [username])

  const handleLinkClick = async (linkId: string) => {
    try {
      // Record the click
      await fetch(`/api/links/${linkId}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        }),
      })
    } catch (err) {
      console.error("Error recording click:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Profile Not Found</h1>
          <p className="mb-6 text-muted-foreground">{error || "The requested profile could not be found."}</p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    )
  }

  const getThemeClasses = () => {
    switch (profile.theme) {
      case "default":
        return "bg-background text-foreground"
      case "minimal":
        return "bg-background text-foreground"
      case "colorful":
        return "bg-primary/10 text-primary-foreground"
      default:
        return "bg-background text-foreground"
    }
  }

  const getBackgroundClasses = () => {
    switch (profile.background) {
      case "solid":
        return "bg-background"
      case "gradient":
        return "bg-gradient-to-b from-primary/20 to-background"
      case "pattern":
        return 'bg-background bg-[url("/geometric-kaleidoscope.png")] bg-repeat'
      default:
        return "bg-background"
    }
  }

  return (
    <div className={`flex min-h-screen flex-col items-center p-4 md:p-8 ${getBackgroundClasses()}`}>
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          {profile.showAvatar && (
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.title} />
              <AvatarFallback>{profile.title?.substring(0, 2)}</AvatarFallback>
            </Avatar>
          )}
          <h1 className="mt-4 text-2xl font-bold">{profile.title}</h1>
          <p className="mt-2 text-center text-muted-foreground">{profile.bio}</p>
        </div>

        <div className="grid w-full gap-4">
          {links.map((link: any) => (
            <Button
              key={link.id}
              variant="outline"
              className="flex w-full items-center justify-between py-6 text-base hover:bg-primary/5"
              onClick={() => {
                handleLinkClick(link.id)
                window.open(link.url, "_blank", "noopener,noreferrer")
              }}
            >
              <div className="flex items-center">
                <span className="ml-2">{link.title}</span>
              </div>
              <ExternalLink className="h-4 w-4 opacity-50" />
            </Button>
          ))}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            Created with{" "}
            <a href="/" className="font-medium underline underline-offset-4">
              LinkHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
