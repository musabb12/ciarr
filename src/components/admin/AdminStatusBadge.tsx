'use client';

import { cn } from '@/lib/utils';

export type AdminStatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const variantStyles: Record<AdminStatusVariant, string> = {
  success: 'bg-emerald-100 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40',
  warning: 'bg-slate-200 dark:bg-slate-600/50 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-500',
  error: 'bg-red-100 dark:bg-red-500/25 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/40',
  info: 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600',
  neutral: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30',
};

export interface AdminStatusBadgeProps {
  children: React.ReactNode;
  variant?: AdminStatusVariant;
  className?: string;
}

export function AdminStatusBadge({ children, variant = 'neutral', className }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
