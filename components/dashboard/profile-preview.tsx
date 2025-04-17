"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react"

interface ProfilePreviewProps {
  profile: {
    title: string
    bio: string
    avatar: string
    theme: string
    background: string
    showAvatar: boolean
    roundedCorners: boolean
    darkMode: boolean
  }
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
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
        return "bg-background bg-[url('/geometric-kaleidoscope.png')] bg-repeat"
      default:
        return "bg-background"
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center overflow-hidden border shadow-sm",
        profile.roundedCorners ? "rounded-lg" : "",
        profile.darkMode ? "dark" : "",
        getBackgroundClasses(),
      )}
    >
      <div className={cn("flex w-full flex-col items-center p-6", getThemeClasses())}>
        {profile.showAvatar && (
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.title} />
            <AvatarFallback>{profile.title.substring(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        <h3 className="text-xl font-bold">{profile.title}</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">{profile.bio}</p>

        <div className="mt-6 grid w-full gap-2">
          <Button variant="outline" className="w-full" size="sm">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Button>
        </div>
      </div>
    </div>
  )
}
