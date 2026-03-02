'use client';

import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(
  () => import('./AdminDashboardClient').then((m) => ({ default: m.AdminDashboardClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh] font-arabic-modern" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-900/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-200/80 font-medium">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    ),
  }
);

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
