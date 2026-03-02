'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export interface AdminTimelineProps {
  items: TimelineItem[];
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-amber-400',
};

export function AdminTimeline({ items, className }: AdminTimelineProps) {
  return (
    <div className={cn('space-y-0', className)} dir="rtl">
      {items.map((item, i) => {
        const Icon = item.icon;
        const dotStyle = variantStyles[item.variant ?? 'default'];
        const isLast = i === items.length - 1;
        return (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn('w-3 h-3 rounded-full shrink-0 mt-1.5', dotStyle)} />
              {!isLast && <div className="w-0.5 flex-1 min-h-[32px] bg-slate-700/50 my-1" />}
            </div>
            <div className={cn('pb-6', !isLast && 'border-b border-amber-900/10')}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-200 text-sm">{item.title}</p>
                <span className="text-xs text-slate-500 shrink-0">{item.time}</span>
              </div>
              {item.description && (
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              )}
              {Icon && <Icon className="w-4 h-4 text-amber-500/60 mt-2" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
