'use client';

import { LucideIcon, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface AdminNotificationCardProps {
  title: string;
  description?: string;
  time?: string;
  variant?: NotificationVariant;
  icon?: LucideIcon;
  unread?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<NotificationVariant, string> = {
  info: 'border-amber-500/30 bg-amber-500/5',
  success: 'border-emerald-500/30 bg-emerald-500/5',
  warning: 'border-amber-500/40 bg-amber-500/10',
  error: 'border-red-500/30 bg-red-500/5',
};

export function AdminNotificationCard({
  title,
  description,
  time,
  variant = 'info',
  icon: Icon = Bell,
  unread = false,
  onClick,
  className,
}: AdminNotificationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-right rounded-xl border p-4 transition-all hover:border-amber-600/40',
        variantStyles[variant],
        unread && 'ring-1 ring-amber-500/30',
        className
      )}
      dir="rtl"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-amber-500/80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-slate-200 text-sm', unread && 'font-semibold')}>{title}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</p>}
          {time && <p className="text-xs text-amber-500/70 mt-2">{time}</p>}
        </div>
      </div>
    </button>
  );
}
