'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminMetricTrendProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  sparkline?: number[]; // قيم مصغرة للرسم
  className?: string;
}

export function AdminMetricTrend({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  sparkline,
  className,
}: AdminMetricTrendProps) {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';
  const max = sparkline?.length ? Math.max(...sparkline) : 1;

  return (
    <Card className={cn(
      'admin-card-luxury rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <span className="admin-card-title text-sm font-semibold">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-amber-600 dark:text-amber-500/80" />}
      </CardHeader>
      <CardContent>
        <p className="admin-card-value text-xl font-bold tabular-nums tracking-tight">
          {value}
          {unit && <span className="admin-card-sub text-sm font-normal mr-1">{unit}</span>}
        </p>
        {(trendLabel || sparkline?.length) && (
          <div className="mt-2 flex items-center gap-2">
            {trendLabel && <span className={cn('text-xs font-medium', trendColor)}>{trendLabel}</span>}
            {sparkline && sparkline.length > 0 && (
              <div className="flex items-end gap-0.5 h-6" aria-hidden>
                {sparkline.map((v, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-amber-600/80 to-amber-400/60 min-h-[4px]"
                    style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
