'use client';

import { LucideIcon, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminAlertBannerVariant = 'info' | 'warning' | 'success' | 'error';

export interface AdminAlertBannerProps {
  title: string;
  description?: string;
  variant?: AdminAlertBannerVariant;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  className?: string;
}

const variantConfig = {
  info: { icon: Info, className: 'border-amber-500/30 bg-amber-500/10 text-amber-200' },
  warning: { icon: AlertTriangle, className: 'border-amber-500/40 bg-amber-500/15 text-amber-200' },
  success: { icon: CheckCircle, className: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200' },
  error: { icon: XCircle, className: 'border-red-500/40 bg-red-500/15 text-red-200' },
};

export function AdminAlertBanner({
  title,
  description,
  variant = 'info',
  icon,
  action,
  onDismiss,
  className,
}: AdminAlertBannerProps) {
  const config = variantConfig[variant];
  const Icon = icon ?? config.icon;
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border p-4',
        config.className,
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm opacity-90 mt-1">{description}</p>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-3 text-sm font-medium underline underline-offset-2 hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-current/70 hover:text-current p-1 rounded"
          aria-label="إغلاق"
        >
          ✕
        </button>
      )}
    </div>
  );
}
