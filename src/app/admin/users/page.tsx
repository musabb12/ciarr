'use client';

import { UsersManagement } from '@/components/admin/UsersManagement';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">المستخدمون</h1>
        <p className="text-slate-400 mt-0.5">إدارة حسابات المستخدمين والأدوار</p>
      </div>
      <UsersManagement />
    </div>
  );
}
