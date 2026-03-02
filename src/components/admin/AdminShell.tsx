'use client';

import { ReactNode, useState } from 'react';
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
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex relative text-slate-100 overflow-hidden" dir="rtl">
      <div className="admin-panel-bg" aria-hidden />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="relative shrink-0">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-900/60 via-slate-950/80 to-amber-800/40 opacity-95" />
          <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="relative admin-glass h-20 flex items-center justify-between gap-6 px-8 border-b border-amber-900/40 shadow-[0_18px_40px_rgba(15,23,42,0.7)]">
            {/* Brand / Identity */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="admin-logo-glow w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-700 flex items-center justify-center ring-2 ring-amber-300/60 shadow-lg shadow-amber-900/40">
                  <span className="text-slate-950 font-black text-lg tracking-tight">C</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">CIAR ADMIN</p>
                  <p className="text-sm font-medium text-amber-50 font-arabic-modern">لوحة تحكم رسمية للمواقع الأربعة عشر</p>
                </div>
              </div>
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl ml-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/80" />
                  <Input
                    placeholder="بحث دقيق في لوحة الإدارة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.trim()) {
                        toast.info(`جاري البحث عن: ${search}`);
                      }
                    }}
                    className="bg-slate-900/50 border border-amber-500/40 text-amber-50 placeholder:text-amber-200/50 focus-visible:ring-amber-400/60 focus-visible:border-amber-300/70 pr-10 h-10 rounded-xl shadow-inner"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.info(search.trim() ? `جاري البحث عن: ${search}` : 'اكتب عبارة للبحث')}
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-[0_10px_30px_rgba(250,204,21,0.55)] h-10 px-5 rounded-xl border border-amber-200/60"
                >
                  بحث
                </Button>
              </div>
            </div>

            {/* Session / Actions */}
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline-flex items-center gap-2 text-[11px] text-amber-100/90 px-3 py-1.5 rounded-full bg-slate-900/40 border border-amber-500/40 shadow-sm shadow-amber-900/30">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.3)]" />
                <span>جلسة إدارية نشطة • {formatTime(timeRemaining)}</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-100/80 hover:text-amber-50 hover:bg-amber-500/20 h-9 w-9 rounded-full border border-amber-500/30 transition-colors"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-100/80 hover:text-amber-50 hover:bg-amber-500/20 h-9 w-9 rounded-full relative border border-amber-500/30 transition-colors"
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
                    className="text-amber-100/90 hover:text-amber-50 hover:bg-amber-500/20 h-9 w-9 rounded-full border border-amber-500/30 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-950/95 backdrop-blur-2xl border border-amber-700/50 shadow-2xl shadow-slate-950/80">
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
