'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminBadgeCountProps {
  count: number;
  icon?: LucideIcon;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-amber-900/20',
  success: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  warning: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
  error: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30',
};

export function AdminBadgeCount({
  count,
  icon: Icon,
  label,
  variant = 'default',
  className,
}: AdminBadgeCountProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium',
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="tabular-nums">{count > 99 ? '99+' : count}</span>
      {label && <span className="text-slate-500 dark:text-slate-400 text-xs">{label}</span>}
    </span>
  );
}
