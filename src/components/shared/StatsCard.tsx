'use client';

import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: number; label?: string }; // نسبة مئوية موجبة أو سالبة
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  const isPositive = trend != null && trend.value >= 0;
  return (
    <Card className={cn('overflow-hidden transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
            {trend != null && (
              <div className="mt-2 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={cn('text-sm font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {isPositive ? '+' : ''}{trend.value}%
                </span>
                {trend.label && <span className="text-muted-foreground text-xs"> {trend.label}</span>}
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
