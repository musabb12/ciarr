'use client';

import { Cpu, HardDrive, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminResourceUsageProps {
  cpu?: number;
  memory?: number;
  disk?: number;
  label?: string;
  className?: string;
}

export function AdminResourceUsage({ cpu = 0, memory = 0, disk = 0, label = 'استخدام الموارد', className }: AdminResourceUsageProps) {
  const bar = (value: number, color: string) => (
    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">{label}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> CPU</span>
            <span>{cpu}%</span>
          </div>
          {bar(cpu, 'bg-amber-500')}
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">الذاكرة</span>
            <span>{memory}%</span>
          </div>
          {bar(memory, 'bg-emerald-500')}
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> القرص</span>
            <span>{disk}%</span>
          </div>
          {bar(disk, 'bg-blue-500')}
        </div>
      </CardContent>
    </Card>
  );
}
