'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Simple token validation (in production, validate with server)
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [timestamp] = decoded.split('-')
      const tokenAge = Date.now() - parseInt(timestamp)
      
      // Token expires after 24 hours
      if (tokenAge > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
        return
      }
      
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return { isAuthenticated, loading, logout }
}