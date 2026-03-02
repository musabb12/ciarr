'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from '@/components/admin/SessionManager';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 pt-12 font-arabic-modern" dir="rtl">
        {children}
      </div>
    );
  }

  return (
    <SessionProvider>
      <div className="font-arabic-modern">
        <AdminShell>
          <AdminErrorBoundary
            fallback={(error, reset) => (
              <div className="p-6">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-slate-100" dir="rtl">
                  <h3 className="font-semibold text-red-400 mb-2">خطأ في تحميل الصفحة</h3>
                  <p className="text-sm text-slate-300 mb-3 font-mono break-all">{error.message}</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}
          >
            {children}
          </AdminErrorBoundary>
        </AdminShell>
      </div>
    </SessionProvider>
  );
}
