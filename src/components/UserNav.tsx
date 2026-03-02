'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useUserAuth } from '@/hooks/useUserAuth'

type UserNavProps = {
  scrolled?: boolean
  variant?: 'desktop' | 'mobile'
  onLinkClick?: () => void
}

export function UserNav({ scrolled = false, variant = 'desktop', onLinkClick }: UserNavProps) {
  const { user, loading, logout } = useUserAuth()

  const linkBase = variant === 'mobile'
    ? 'block px-4 py-3 rounded-2xl bg-gradient-to-r from-white/60 to-white/30 dark:from-gray-900/60 dark:to-gray-900/20 border border-white/40 dark:border-gray-800 text-base font-medium text-gray-800 dark:text-gray-100 hover:shadow-lg transition text-center'
    : `inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-arabic-modern shrink-0 ${
        scrolled 
          ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200' 
          : 'text-white/95 hover:text-white hover:bg-white/20 border border-white/30'
      }`

  if (loading) {
    return null
  }

  if (user) {
    if (variant === 'mobile') {
      return (
        <div className="space-y-2">
          <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            مرحباً، {user.name || user.email}
          </div>
          <Link href="/account" onClick={onLinkClick} className={linkBase}>
            حسابي
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              onLinkClick?.()
              logout()
            }}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            تسجيل الخروج
          </Button>
        </div>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`gap-2 font-arabic-modern ${
              scrolled ? 'text-gray-700 hover:text-gray-900 hover:bg-amber-50' : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {user.name || user.email}
            </span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" dir="rtl">
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              حسابي
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center gap-2 cursor-pointer sm:hidden">
              <Settings className="w-4 h-4" />
              إعدادات الحساب
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const linkProps = { onClick: onLinkClick }
  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={linkBase} {...linkProps}>
        تسجيل الدخول
      </Link>
      <Link href="/register" className={linkBase} {...linkProps}>
        إنشاء حساب
      </Link>
    </div>
  )
}
