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
        'inline-flex items-center gap-2 text-sm text-amber-200/80 px-3 py-1.5 rounded-lg bg-amber-900/20 border border-amber-800/30',
        className
      )}
      dir="rtl"
    >
      <Calendar className="w-4 h-4 text-amber-500/70" />
      {format(startDate)} — {format(endDate)}
    </span>
  );
}
