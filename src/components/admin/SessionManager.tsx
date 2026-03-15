'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface SessionContextType {
  sessionValid: boolean
  timeRemaining: number
  logout: () => void
  extendSession: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)
const SESSION_DURATION_SECONDS = 2 * 60 * 60 // ساعتان

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [sessionValid, setSessionValid] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION_SECONDS)
  const [showWarning, setShowWarning] = useState(false)
  const [warningCountdown, setWarningCountdown] = useState(300)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()

  // التحقق من الجلسة كل ثانية
  useEffect(() => {
    const checkSession = () => {
      const sessionId = getReadableSession()

      if (!sessionId) {
        if (!hasRedirected) {
          redirectToLogin()
        }
        setSessionValid(false)
        return
      }

      const expiresAt = extractExpiry(sessionId)

      if (!expiresAt) {
        if (!hasRedirected) {
          redirectToLogin()
        }
        setSessionValid(false)
        return
      }

      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      setTimeRemaining(remaining)

      if (remaining <= 300 && remaining > 0 && !showWarning) {
        setShowWarning(true)
        setWarningCountdown(remaining)
      }

      if (remaining === 0) {
        handleAutoLogout()
      }
    }

    const interval = setInterval(checkSession, 1000)
    return () => clearInterval(interval)
  }, [timeRemaining, showWarning, hasRedirected])

  // العد التنازلي للتحذير
  useEffect(() => {
    if (showWarning && warningCountdown > 0) {
      const timer = setTimeout(() => {
        setWarningCountdown(warningCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showWarning, warningCountdown])

  const redirectToLogin = () => {
    const currentPath = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/admin'

    setHasRedirected(true)
    router.replace(`/admin/login?redirect=${encodeURIComponent(currentPath || '/admin')}`)
  }

  const handleAutoLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Auto logout error:', error)
    }
    
    setSessionValid(false)
    clearReadableSession()
    router.push('/admin/login?expired=true')
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    setSessionValid(false)
    clearReadableSession()
    router.push('/admin/login')
  }

  const extendSession = async () => {
    try {
      const response = await fetch('/api/admin/auth/extend', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        if (data.sessionId) {
          syncReadableSession(data.sessionId)
          const expiresAt = extractExpiry(data.sessionId)
          if (expiresAt) {
            const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
            setTimeRemaining(remaining)
          } else {
            setTimeRemaining(SESSION_DURATION_SECONDS)
          }
        } else {
          setTimeRemaining(SESSION_DURATION_SECONDS)
        }
        setShowWarning(false)
        setWarningCountdown(300)
      }
    } catch (error) {
      console.error('Extend session error:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (!sessionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-200 border-t-amber-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">جاري التحويل إلى صفحة تسجيل الدخول...</p>
          <p className="text-sm text-gray-500 mt-2">إذا لم يتم التحويل تلقائياً، <a href="/admin/login" className="text-amber-600 underline">اضغط هنا</a></p>
        </div>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ sessionValid, timeRemaining, logout, extendSession }}>
      {children}

      {/* Session Warning Modal — يظهر فقط عند اقتراب انتهاء الجلسة */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  تنبيه انتهاء الجلسة
                </h3>
                
                <Alert className="mb-4 border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    ستنتهي جلستك خلال {warningCountdown} ثانية
                  </AlertDescription>
                </Alert>
                
                <p className="text-sm text-gray-600 mb-6">
                  سيتم تسجيل خروجك تلقائياً عند انتهاء الجلسة.
                </p>
                
                <div className="flex space-x-3 space-x-reverse">
                  <Button
                    onClick={extendSession}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    تمديد الجلسة (ساعتان)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    تسجيل الخروج الآن
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </SessionContext.Provider>
  )
}

function getReadableSession(): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  return document.cookie
    .split('; ')
    .find(row => row.startsWith('admin-session='))
    ?.split('=')[1] ?? null
}

function extractExpiry(sessionId: string): number | null {
  try {
    const [encodedPayload] = sessionId.split('.')
    if (!encodedPayload) return null
    const payloadString = decodeURIComponent(encodedPayload)
    const payload = JSON.parse(payloadString) as { expiresAt?: number }
    return typeof payload.expiresAt === 'number' ? payload.expiresAt : null
  } catch (error) {
    console.error('Failed to parse session payload:', error)
    return null
  }
}

function syncReadableSession(sessionId: string) {
  if (typeof document === 'undefined') {
    return
  }

  const isSecureContext = typeof window !== 'undefined'
    ? window.location.protocol === 'https:'
    : true

  const secureFlag = isSecureContext ? '; secure' : ''
  document.cookie = `admin-session=${sessionId}; path=/; max-age=${SESSION_DURATION_SECONDS}; samesite=strict${secureFlag}`
}

function clearReadableSession() {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = 'admin-session=; path=/; max-age=0; samesite=strict'
}