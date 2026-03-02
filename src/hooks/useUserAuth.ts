'use client'

import { useEffect, useState, useCallback } from 'react'

export type User = {
  id: string
  email: string
  name: string | null
  role?: string
}

export function useUserAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch {
      setUser(null)
      window.location.href = '/'
    }
  }, [])

  return { user, loading, logout, refresh: fetchSession }
}
