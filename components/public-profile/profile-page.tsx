"use client"
import { useCachedData } from "@/hooks/use-cached-data"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import type { PublicProfile } from "@/types"

interface ProfilePageProps {
  username: string
}

export function PublicProfilePage({ username }: ProfilePageProps) {
  const {
    data: profile,
    error,
    isLoading,
  } = useCachedData<PublicProfile>(`/api/users/${username}`, {
    revalidateOnFocus: false, // Don't revalidate on focus for public profiles
    dedupingInterval: 60000, // Cache for 1 minute on client side
  })

  const handleLinkClick = async (linkId: string, url: string) => {
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

      // Open the link
      window.open(url, "_blank")
    } catch (error) {
      console.error("Error recording click:", error)
      // Open the link even if there's an error recording the click
      window.open(url, "_blank")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto p-4 space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full" />
        <div className="w-full space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-muted-foreground">The profile you're looking for doesn't exist or isn't available.</p>
        </div>
      </div>
    )
  }

  // Determine theme classes based on profile settings
  const getThemeClasses = () => {
    const { profile: profileData } = profile

    if (!profileData) return ""

    let themeClasses = ""

    // Color theme
    switch (profileData.theme) {
      case "dark":
        themeClasses += " bg-gray-900 text-white"
        break
      case "light":
        themeClasses += " bg-gray-100 text-gray-900"
        break
      case "purple":
        themeClasses += " bg-purple-100 text-purple-900"
        break
      case "green":
        themeClasses += " bg-green-100 text-green-900"
        break
      case "blue":
        themeClasses += " bg-blue-100 text-blue-900"
        break
      case "red":
        themeClasses += " bg-red-100 text-red-900"
        break
      default:
        themeClasses += profileData.darkMode ? " bg-gray-900 text-white" : " bg-white text-gray-900"
    }

    // Background
    if (profileData.background === "gradient") {
      themeClasses = themeClasses.replace(/bg-\w+-\d+/, "")
      themeClasses += profileData.darkMode
        ? " bg-gradient-to-br from-gray-900 to-gray-800"
        : " bg-gradient-to-br from-white to-gray-100"
    }

    return themeClasses
  }

  // Determine classes for link buttons
  const getLinkButtonClasses = () => {
    const { profile: profileData } = profile

    if (!profileData) return "bg-gray-100 hover:bg-gray-200 text-gray-900"

    let buttonClasses = "w-full flex items-center p-3 mb-3 transition-all"

    // Rounded corners
    buttonClasses += profileData.roundedCorners ? " rounded-lg" : " rounded-none"

    // Color theme for buttons
    switch (profileData.theme) {
      case "dark":
        buttonClasses += " bg-gray-800 hover:bg-gray-700 text-white"
        break
      case "light":
        buttonClasses += " bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
        break
      case "purple":
        buttonClasses += " bg-purple-100 hover:bg-purple-200 text-purple-900"
        break
      case "green":
        buttonClasses += " bg-green-100 hover:bg-green-200 text-green-900"
        break
      case "blue":
        buttonClasses += " bg-blue-100 hover:bg-blue-200 text-blue-900"
        break
      case "red":
        buttonClasses += " bg-red-100 hover:bg-red-200 text-red-900"
        break
      default:
        buttonClasses += profileData.darkMode
          ? " bg-gray-800 hover:bg-gray-700 text-white"
          : " bg-white hover:bg-gray-100 text-gray-900 border border-gray-200"
    }

    return buttonClasses
  }

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 ${getThemeClasses()}`}>
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          {profile.profile?.showAvatar && (
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profile.profile.avatar || "/placeholder.svg"} alt={profile.user.name} />
              <AvatarFallback>{profile.user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}

          <h1 className="text-2xl font-bold">{profile.profile?.title || profile.user.name}</h1>

          {profile.profile?.bio && <p className="mt-2 text-muted-foreground">{profile.profile.bio}</p>}
        </div>

        <div className="space-y-3">
          {profile.links.map((link) => (
            <Button
              key={link.id}
              className={getLinkButtonClasses()}
              variant="ghost"
              onClick={() => handleLinkClick(link.id, link.url)}
            >
              <Icons name={link.icon} className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">{link.title}</span>
            </Button>
          ))}

          {profile.links.length === 0 && (
            <div className="p-6 text-center border rounded-lg">
              <p className="text-muted-foreground">This profile doesn't have any links yet.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Created with LinkHub</p>
        </div>
      </div>
    </div>
  )
}
