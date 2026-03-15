'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label?: string }; // نسبة مئوية
  trendUp?: boolean;
  className?: string;
  iconClassName?: string;
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  className,
  iconClassName,
}: AdminStatCardProps) {
  return (
    <Card className={cn(
      'admin-card-luxury overflow-hidden rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="admin-card-title text-sm font-semibold">{title}</span>
        <div className={cn('rounded-xl p-2.5 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600', iconClassName)}>
          <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="admin-card-value text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        {(subtitle || trend) && (
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            {subtitle && <span className="admin-card-sub text-xs">{subtitle}</span>}
            {trend !== undefined && (
              <span
                className={cn(
                  'text-xs font-medium inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md',
                  trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                )}
              >
                {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
