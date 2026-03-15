'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminMetricGaugeProps {
  title: string;
  value: number; // 0-100
  unit?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'stroke-amber-500',
  success: 'stroke-emerald-500',
  warning: 'stroke-amber-500',
  error: 'stroke-red-500',
};

export function AdminMetricGauge({
  title,
  value,
  unit = '%',
  icon: Icon,
  variant = 'default',
  className,
}: AdminMetricGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <Card className={cn(
      'admin-card-luxury rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="admin-card-title text-sm font-semibold">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-amber-600 dark:text-amber-500/80" />}
      </CardHeader>
      <CardContent>
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn('transition-all duration-500', variantStyles[variant])}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="admin-card-value text-lg font-bold tabular-nums">
              {Math.round(clamped)}
              {unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
