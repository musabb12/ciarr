'use client';

import { FontSettingsManagement } from '@/components/admin/FontSettingsManagement';
import { Type } from 'lucide-react';

export default function AdminFontsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1e3a8a]/10 text-[#1e3a8a dark:bg-amber-500/15 dark:text-amber-400">
            <Type className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight dark:text-slate-100">
              إعدادات الخطوط
            </h1>
            <p className="text-[#475569] text-sm mt-0.5 dark:text-slate-400">
              اختيار خطوط العناوين والنصوص المعروضة على الموقع — إعدادات رسمية تُطبَّق على كامل الموقع
            </p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-l from-transparent via-[#e2e8f0] to-transparent dark:via-slate-600" />
      </header>
      <FontSettingsManagement />
    </div>
  );
}
