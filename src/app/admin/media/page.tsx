'use client';

import { FileManager } from '@/components/admin/FileManager';

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">الوسائط</h1>
        <p className="text-slate-400 mt-0.5">رفع وإدارة الصور والملفات</p>
      </div>
      <FileManager />
    </div>
  );
}
