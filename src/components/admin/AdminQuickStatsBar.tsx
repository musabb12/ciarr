'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuickStatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export interface AdminQuickStatsBarProps {
  items: QuickStatItem[];
  className?: string;
}

export function AdminQuickStatsBar({ items, className }: AdminQuickStatsBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700', className)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="rounded-lg p-2 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600">
                <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                {item.value}
                {item.trend && (
                  <span
                    className={cn(
                      'mr-1 text-xs',
                      item.trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                      item.trend === 'down' && 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {item.trend === 'up' && '↑'}
                    {item.trend === 'down' && '↓'}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
