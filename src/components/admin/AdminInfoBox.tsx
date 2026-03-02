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
    className: 'border-amber-500/30 bg-slate-800/50 backdrop-blur-sm text-amber-200/90 shadow-lg shadow-black/5',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/40 bg-amber-500/15 text-amber-200 shadow-lg shadow-amber-900/10',
  },
  success: {
    icon: CheckCircle,
    className: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200 shadow-lg shadow-emerald-900/10',
  },
  error: {
    icon: XCircle,
    className: 'border-red-500/40 bg-red-500/15 text-red-200 shadow-lg shadow-red-900/10',
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
