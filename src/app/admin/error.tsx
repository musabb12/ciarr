'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-arabic-modern"
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-slate-100 mb-2">حدث خطأ في لوحة الإدارة</h1>
        <p className="text-slate-400 text-sm mb-6">
          عذراً، حدث خطأ غير متوقع. جرب تحديث الصفحة أو العودة للرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            الرئيسية
          </a>
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
}
