'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  status?: 'success' | 'failed' | 'pending';
}

export interface AdminScheduledTasksListProps {
  tasks?: ScheduledTask[];
  className?: string;
}

const defaultTasks: ScheduledTask[] = [
  { id: '1', name: 'نسخ احتياطي يومي', schedule: '0 2 * * *', lastRun: 'منذ 6 ساعات', nextRun: 'خلال 18 ساعة', status: 'success' },
  { id: '2', name: 'تنظيف الجلسات', schedule: '0 * * * *', lastRun: 'منذ 23 دقيقة', nextRun: 'خلال 37 دقيقة', status: 'success' },
  { id: '3', name: 'تقرير التحليلات', schedule: '0 9 * * 1', lastRun: '—', nextRun: 'الإثنين 9:00', status: 'pending' },
];

export function AdminScheduledTasksList({ tasks = defaultTasks, className }: AdminScheduledTasksListProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">المهام المجدولة</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
          >
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cron: {t.schedule}</p>
            </div>
            <div className="text-left">
              {t.lastRun && <p className="text-xs text-slate-500 dark:text-slate-400">آخر تشغيل: {t.lastRun}</p>}
              {t.nextRun && <p className="text-xs text-slate-600 dark:text-slate-300">التالي: {t.nextRun}</p>}
            </div>
            <div>
              {t.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              {t.status === 'failed' && <span className="text-red-500 text-xs">فشل</span>}
              {t.status === 'pending' && <Circle className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
