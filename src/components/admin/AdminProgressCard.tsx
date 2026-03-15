'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface AdminProgressCardProps {
  title: string;
  value: number; // 0-100
  label?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-amber-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export function AdminProgressCard({
  title,
  value,
  label,
  icon: Icon,
  variant = 'default',
  className,
}: AdminProgressCardProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <Card className={cn(
      'admin-card-luxury rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="admin-card-title text-sm font-semibold">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-[#1e3a8a] dark:text-amber-500/80" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="admin-card-value text-base font-bold tabular-nums">{clamped}%</span>
            {label && <span className="admin-card-sub">{label}</span>}
          </div>
          <Progress value={clamped} className="h-2.5 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-[#1e3a8a] [&>div]:to-[#1e40af] dark:[&>div]:from-amber-500 dark:[&>div]:to-amber-600 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
