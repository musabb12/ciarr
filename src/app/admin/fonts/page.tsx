'use client';

import { FontSettingsManagement } from '@/components/admin/FontSettingsManagement';

export default function AdminFontsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">إعدادات الخطوط</h1>
        <p className="text-slate-400 mt-0.5">
          اختيار خطوط العناوين والنصوص المعروضة على الموقع العام
        </p>
      </div>
      <FontSettingsManagement />
    </div>
  );
}
