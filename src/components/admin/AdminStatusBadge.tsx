'use client';

import { cn } from '@/lib/utils';

export type AdminStatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const variantStyles: Record<AdminStatusVariant, string> = {
  success: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-900/20',
  warning: 'bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-900/20',
  error: 'bg-red-500/25 text-red-300 border-red-500/40 shadow-sm shadow-red-900/20',
  info: 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-900/10',
  neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
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
