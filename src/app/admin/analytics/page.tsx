'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">التحليلات</h1>
        <p className="text-slate-400 mt-0.5">إحصائيات الزيارات والأداء</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <BarChart3 className="w-5 h-5" />
            الرسوم البيانية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts />
        </CardContent>
      </Card>
    </div>
  );
}
