'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminDateRangeDisplayProps {
  start: Date | string;
  end: Date | string;
  format?: (d: Date) => string;
  className?: string;
}

const defaultFormat = (d: Date) =>
  d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

export function AdminDateRangeDisplay({
  start,
  end,
  format = defaultFormat,
  className,
}: AdminDateRangeDisplayProps) {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600',
        className
      )}
      dir="rtl"
    >
      <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      {format(startDate)} — {format(endDate)}
    </span>
  );
}
