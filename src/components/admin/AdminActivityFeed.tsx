'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export interface AdminActivityFeedProps {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
  emptyMessage?: string;
  className?: string;
}

const variantDot: Record<string, string> = {
  default: 'bg-slate-500 ring-2 ring-slate-500/20',
  success: 'bg-emerald-500 ring-2 ring-emerald-500/20',
  warning: 'bg-amber-500 ring-2 ring-amber-500/20',
  info: 'bg-amber-400/80 ring-2 ring-amber-400/20',
};

export function AdminActivityFeed({
  title = 'النشاط الأخير',
  items,
  maxItems = 5,
  emptyMessage = 'لا يوجد نشاط',
  className,
}: AdminActivityFeedProps) {
  const list = items.slice(0, maxItems);

  return (
    <Card className={cn(
      'admin-card-luxury rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader>
        <CardTitle className="text-slate-100 text-base font-arabic-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">{emptyMessage}</p>
        ) : (
          <ul className="space-y-4">
            {list.map((item, i) => {
              const Icon = item.icon;
              const dot = variantDot[item.variant ?? 'default'];
              return (
                <li key={item.id} className="flex gap-3">
                  <span className={cn('mt-1.5 w-2 h-2 rounded-full shrink-0', dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{item.title}</p>
                    {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                  {Icon && <Icon className="w-4 h-4 text-slate-500 shrink-0" />}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
