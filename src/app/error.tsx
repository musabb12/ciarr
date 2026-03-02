'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        direction: 'rtl',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        <div
          style={{
            width: '5rem',
            height: '5rem',
            margin: '0 auto 1.5rem',
            borderRadius: '1rem',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
          }}
        >
          ⚠️
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          حدث خطأ ما
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: 1.6 }}>
          عذراً، حدث خطأ غير متوقع. جرب تحديث الصفحة أو العودة للرئيسية.
        </p>
        <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.875rem' }}>
          إذا استمر الخطأ: تأكد من وجود ملف <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: 4 }}>.env</code> وقيمة <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: 4 }}>DATABASE_URL</code>، ثم نفّذ <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: 4 }}>npx prisma generate</code> و <code style={{ background: '#f3f4f6', padding: '0.125rem 0.375rem', borderRadius: 4 }}>npx prisma migrate deploy</code> وأعد تشغيل الخادم.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: '#f59e0b',
              color: '#111827',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: '2px solid #fcd34d',
              color: '#92400e',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
