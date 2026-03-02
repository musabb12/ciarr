'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ width: '5rem', height: '5rem', margin: '0 auto 1.5rem', borderRadius: '1rem', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            حدث خطأ في التطبيق
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
            عذراً، حدث خطأ غير متوقع. جرب تحديث الصفحة.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => reset()}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#f59e0b', color: '#111827', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              إعادة المحاولة
            </button>
            <a
              href="/"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: '2px solid #fcd34d', color: '#92400e', fontWeight: 600, textDecoration: 'none' }}
            >
              الرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
