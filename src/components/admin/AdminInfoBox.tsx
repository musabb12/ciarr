'use client';

import { LucideIcon, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminInfoBoxVariant = 'info' | 'warning' | 'success' | 'error';

const variantConfig: Record<
  AdminInfoBoxVariant,
  { icon: LucideIcon; className: string }
> = {
  info: {
    icon: Info,
    className: 'border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 shadow-sm',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 shadow-sm',
  },
  success: {
    icon: CheckCircle,
    className: 'border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 shadow-sm',
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 text-red-800 dark:text-red-200 shadow-sm',
  },
};

export interface AdminInfoBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: AdminInfoBoxVariant;
  icon?: LucideIcon;
  className?: string;
}

export function AdminInfoBox({
  title,
  children,
  variant = 'info',
  icon,
  className,
}: AdminInfoBoxProps) {
  const config = variantConfig[variant];
  const Icon = icon ?? config.icon;

  return (
    <div
      className={cn(
        'rounded-xl border p-5 flex gap-3',
        config.className,
        className
      )}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="min-w-0">
        {title && <p className="font-medium text-sm mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
