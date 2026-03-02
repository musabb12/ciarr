'use client';

import { NewsManagement } from '@/components/admin/NewsManagement';

export default function AdminNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">الأخبار</h1>
        <p className="text-slate-400 mt-0.5">إدارة شريط الأخبار على الصفحة الرئيسية</p>
      </div>
      <NewsManagement />
    </div>
  );
}
