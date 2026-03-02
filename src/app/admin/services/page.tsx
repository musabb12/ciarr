'use client';

import { ServicesManagement } from '@/components/admin/ServicesManagement';

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">الخدمات</h1>
        <p className="text-slate-400 mt-0.5">إدارة الخدمات المعروضة على الموقع</p>
      </div>
      <ServicesManagement />
    </div>
  );
}
