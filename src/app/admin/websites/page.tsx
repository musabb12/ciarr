'use client';

import { WebsitesManagement } from '@/components/admin/WebsitesManagement';

export default function AdminWebsitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">المواقع</h1>
        <p className="text-slate-400 mt-0.5">إدارة المواقع الـ 14 وعرضها على الصفحة الرئيسية</p>
      </div>
      <WebsitesManagement />
    </div>
  );
}
