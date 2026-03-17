'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Gauge, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminRateLimitDisplayProps {
  used: number;
  limit: number;
  label?: string;
  resetIn?: string;
  className?: string;
}

export function AdminRateLimitDisplay({
  used,
  limit,
  label = 'طلبات API',
  resetIn,
  className,
}: AdminRateLimitDisplayProps) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">{label}</span>
        </div>
        {isNearLimit && <AlertTriangle className="w-4 h-4 text-amber-500" />}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>{used} / {limit}</span>
          {resetIn && <span>إعادة تعيين: {resetIn}</span>}
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
