'use client';

import { useEffect } from 'react';

export default function WebsitesError({
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
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        direction: 'rtl',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>حدث خطأ في تحميل المواقع.</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            background: '#f59e0b',
            color: '#111827',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
