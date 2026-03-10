'use client';

import { ReactNode, useState } from 'react';
import { useTheme } from 'next-themes';
import { useSession } from '@/components/admin/SessionManager';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Search, Bell, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export function AdminShell({ children }: { children: ReactNode }) {
  const { logout, timeRemaining } = useSession();
  const [search, setSearch] = useState('');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex relative text-foreground overflow-hidden admin-shell-wrapper" dir="rtl">
      <div className="admin-panel-bg" aria-hidden />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="relative shrink-0 admin-header">
          <div className="pointer-events-none absolute inset-0 admin-header-gradient" />
          <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px admin-header-line" />
          <div className="relative admin-glass h-20 flex items-center justify-between gap-6 px-8 border-b admin-header-border">
            {/* Brand / Identity */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="admin-logo-glow w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-700 flex items-center justify-center ring-2 ring-amber-300/60 shadow-lg shadow-amber-900/40">
                  <span className="text-slate-950 font-black text-lg tracking-tight">C</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs uppercase tracking-[0.25em] admin-brand-label">CIAR ADMIN</p>
                  <p className="text-sm font-medium admin-brand-desc font-arabic-modern">لوحة تحكم رسمية للمواقع الأربعة عشر</p>
                </div>
              </div>
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl ml-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-search-icon" />
                  <Input
                    placeholder="بحث دقيق في لوحة الإدارة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim()) {
                        toast.info(`جاري البحث عن: ${search}`);
                      }
                    }}
                    className="admin-search-input pr-10 h-10 rounded-xl"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.info(search.trim() ? `جاري البحث عن: ${search}` : 'اكتب عبارة للبحث')}
                  className="admin-search-btn h-10 px-5 rounded-xl"
                >
                  بحث
                </Button>
              </div>
            </div>

            {/* Session / Actions */}
            <div className="flex items-center gap-3">
              <span className="admin-session-badge hidden lg:inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.3)]" />
                <span>جلسة إدارية نشطة • {formatTime(timeRemaining)}</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="admin-theme-toggle h-9 w-9 rounded-full border transition-colors"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="admin-icon-btn h-9 w-9 rounded-full relative border transition-colors"
                onClick={() => toast.info('لا توجد إشعارات جديدة حالياً')}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="admin-icon-btn h-9 w-9 rounded-full border transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="admin-dropdown w-56">
                  <DropdownMenuItem className="flex flex-col items-start gap-0.5 cursor-default">
                    <span className="text-xs text-amber-300/90">وضع الإدارة</span>
                    <span className="text-[11px] text-slate-400">مراجعة شاملة لإعدادات المنصّة</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/admin/settings" className="w-full flex items-center justify-between focus:bg-amber-900/30 focus:text-amber-100">
                      <span>إعدادات الموقع</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 focus:bg-red-900/25 focus:text-red-200 mt-1"
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج الآمن
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
