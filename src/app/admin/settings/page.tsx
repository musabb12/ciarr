'use client';

import { SettingsManagement } from '@/components/admin/SettingsManagement';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">إعدادات الموقع</h1>
        <p className="text-slate-400 mt-0.5">التحكم في اسم الموقع، الشعار، الألوان، البريد، والأمان</p>
      </div>
      <SettingsManagement />
    </div>
  );
}
