'use client'

import { useState, useEffect } from 'react'

interface UseLoadingReturn {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export function useLoading(initialState = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  return {
    isLoading,
    startLoading,
    stopLoading
  }
}

// Hook for loading states with timeout
export function useLoadingWithTimeout(timeout = 10000) {
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const startLoading = () => {
    setIsLoading(true)
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, timeout)
  }

  const stopLoading = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isLoading,
    startLoading,
    stopLoading
  }
}