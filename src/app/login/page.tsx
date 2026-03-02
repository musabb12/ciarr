'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, Loader2, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailValid = !email || EMAIL_REGEX.test(email.trim())
  const showEmailError = emailTouched && email && !emailValid

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setSuccess('تم إنشاء حسابك بنجاح. يمكنك تسجيل الدخول الآن.')
    }
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    fetch('/api/auth/session', { signal: controller.signal })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data?.user) router.replace(searchParams.get('redirect') || '/account')
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer))
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEmailTouched(true)
    if (email && !EMAIL_REGEX.test(email.trim())) {
      setError('أدخل بريداً إلكترونياً صحيحاً.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      let data: { error?: string } = {}
      try {
        const text = await response.text()
        data = text ? JSON.parse(text) : {}
      } catch {
        setError(response.ok ? 'حدث خطأ غير متوقع' : `خطأ من الخادم (${response.status}).`)
        return
      }
      if (response.ok) {
        router.push(searchParams.get('redirect') || '/')
        router.refresh()
        return
      }
      setError(data.error || 'فشل تسجيل الدخول')
    } catch (err) {
      setError('فشل الاتصال. تحقق من اتصالك وجرب مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-arabic-modern relative overflow-hidden"
      dir="rtl"
    >
      {/* زر الثيم - زاوية الصفحة */}
      <div className="absolute top-4 left-4 z-10">
        <ThemeToggle variant="dropdown" className="rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border border-stone-600/50" />
      </div>
      {/* خلفية فاخرة */}
      <div className="absolute inset-0 bg-luxury" />
      <div className="absolute inset-0 bg-luxury-radial pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23f59e0b' fill-opacity='1' fill-rule='nonzero'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Card className="card-luxury card-luxury-accent overflow-hidden border-0 shadow-[var(--luxury-shadow-lg)]">
          <CardHeader className="text-center pb-4 pt-10 px-8">
            <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/30" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/20" />
              <LogIn className="w-9 h-9 text-white relative z-10 drop-shadow-sm" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-stone-900 font-arabic-heading tracking-tight">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-stone-500 mt-2 text-base font-arabic-modern">
              أدخل بياناتك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-stone-700">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  onBlur={() => setEmailTouched(true)}
                  required
                  placeholder="example@email.com"
                  className={`input-luxury text-right h-12 ${showEmailError ? 'border-red-300 focus-visible:ring-red-400/30' : ''}`}
                  autoComplete="email"
                  aria-invalid={showEmailError ? true : undefined}
                />
                {showEmailError && (
                  <p className="text-xs text-red-600">أدخل بريداً إلكترونياً صحيحاً</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-stone-700">
                    كلمة المرور
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-gold-light hover:text-gold font-medium transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    required
                    placeholder="••••••••"
                    className="input-luxury text-right pr-12 h-12"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 text-stone-400 hover:text-stone-600 hover:bg-stone-100/80 rounded-l-xl"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {success && (
                <Alert className="border-emerald-200 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-900/20 rounded-xl">
                  <AlertDescription className="text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full h-12 btn-luxury text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2 inline-block" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>
            <p className="mt-8 text-center text-sm text-stone-500">
              ليس لديك حساب؟{' '}
              <Link
                href="/register"
                className="font-semibold text-gold-light hover:text-gold transition-colors underline-offset-2 hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="text-center text-stone-500/80 text-xs mt-6 font-arabic-modern">
          شركة CIAR — خدمات رقمية بمعايير عالمية
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-arabic-modern bg-luxury" dir="rtl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/50 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-stone-400">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
