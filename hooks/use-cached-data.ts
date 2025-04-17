"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UseCachedDataOptions<T> {
  initialData?: T
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number
}

export function useCachedData<T>(url: string, options: UseCachedDataOptions<T> = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  // Default options
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2000, // 2 seconds
  } = options

  // Keep track of the last fetch time
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  // Function to fetch data
  const fetchData = async (showLoading = true) => {
    // Check deduping interval
    const now = Date.now()
    if (now - lastFetchTime < dedupingInterval) {
      return
    }

    if (showLoading) {
      setIsLoading(true)
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        throw new Error(result.message || "An error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLastFetchTime(Date.now())
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [url])

  // Set up revalidation on focus
  useEffect(() => {
    if (!revalidateOnFocus) return

    const onFocus = () => {
      fetchData(false)
    }

    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [revalidateOnFocus, url])

  // Set up revalidation on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return

    const onOnline = () => {
      fetchData(false)
    }

    window.addEventListener("online", onOnline)
    return () => {
      window.removeEventListener("online", onOnline)
    }
  }, [revalidateOnReconnect, url])

  // Manual revalidation function
  const revalidate = () => {
    fetchData()
  }

  return { data, error, isLoading, revalidate }
}
