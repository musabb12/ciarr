'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityAudit } from '@/components/admin/SecurityAudit';
import { Shield } from 'lucide-react';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">الأمان</h1>
        <p className="text-slate-400 mt-0.5">تدقيق الأمان وإعدادات الجلسة وكلمة المرور</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Shield className="w-5 h-5" />
            تدقيق الأمان
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SecurityAudit />
        </CardContent>
      </Card>
    </div>
  );
}
