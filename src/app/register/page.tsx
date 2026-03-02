'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, UserPlus, Loader2, Check, Circle } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_LENGTH = 8

function passwordStrength(pwd: string): 'weak' | 'medium' | 'strong' | null {
  if (!pwd) return null
  let score = 0
  if (pwd.length >= MIN_LENGTH) score++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++
  if (score <= 1) return 'weak'
  if (score <= 2) return 'medium'
  return 'strong'
}

function RegisterContent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const strength = useMemo(() => passwordStrength(password), [password])
  const passwordsMatch = !confirmPassword || password === confirmPassword
  const passwordLongEnough = password.length >= MIN_LENGTH

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)
    fetch('/api/auth/session', { signal: controller.signal })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data?.user) router.replace('/account')
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين')
      return
    }
    if (password.length < MIN_LENGTH) {
      setError(`كلمة المرور يجب أن تكون ${MIN_LENGTH} أحرف على الأقل`)
      return
    }
    if (email && !EMAIL_REGEX.test(email.trim())) {
      setError('أدخل بريداً إلكترونياً صحيحاً.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
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
        router.push('/login?registered=1')
        return
      }
      setError(data.error || 'فشل إنشاء الحساب')
    } catch (err) {
      setError('فشل الاتصال. تحقق من اتصالك بالإنترنت وجرب مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-gray-50 to-orange-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 font-arabic-modern" dir="rtl">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-2xl border border-amber-100/50 dark:border-amber-900/30 overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-200/30 dark:ring-amber-800/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white font-arabic-heading">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">أدخل بياناتك لإنشاء حساب والاستفادة من الخدمات</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">الاسم (اختياري)</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="text-right h-11" autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} required placeholder="example@email.com" className="text-right h-11" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    required
                    minLength={MIN_LENGTH}
                    placeholder={`${MIN_LENGTH} أحرف على الأقل`}
                    className="text-right pr-12 h-11"
                    autoComplete="new-password"
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 rounded-l-md" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className={passwordLongEnough ? 'text-emerald-600 dark:text-emerald-400' : ''}>{passwordLongEnough ? <Check className="inline h-3.5 w-3.5 ml-0.5" /> : <Circle className="inline h-3.5 w-3.5 ml-0.5 opacity-50" />} 8 أحرف على الأقل</span>
                  {password && <span className={strength === 'weak' ? 'text-amber-600' : strength === 'medium' ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}>{strength === 'weak' ? 'ضعيفة' : strength === 'medium' ? 'متوسطة' : 'قوية'}</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                    required
                    minLength={MIN_LENGTH}
                    placeholder="أعد إدخال كلمة المرور"
                    className={`text-right pr-12 h-11 ${confirmPassword && !passwordsMatch ? 'border-destructive focus-visible:ring-destructive/50' : ''}`}
                    autoComplete="new-password"
                    aria-invalid={!!confirmPassword && !passwordsMatch}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 rounded-l-md" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'إخفاء' : 'إظهار'}>
                    {showConfirm ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </Button>
                </div>
                {confirmPassword && !passwordsMatch && <p className="text-xs text-destructive">كلمة المرور وتأكيدها غير متطابقتين</p>}
                {confirmPassword && passwordsMatch && <p className="text-xs text-emerald-600 dark:text-emerald-400">تطابق كلمة المرور</p>}
              </div>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg transition-all hover:shadow-xl disabled:opacity-70" disabled={loading}>
                {loading ? <><Loader2 className="w-5 h-5 animate-spin ml-2 inline-block" /> جاري إنشاء الحساب...</> : 'إنشاء الحساب'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 underline-offset-2 hover:underline">تسجيل الدخول</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-arabic-modern" dir="rtl"><p className="text-gray-600">جاري التحميل...</p></div>}>
      <RegisterContent />
    </Suspense>
  )
}
