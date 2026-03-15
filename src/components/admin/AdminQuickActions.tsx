'use client';

import Link from 'next/link';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface QuickActionItem {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
}

export interface AdminQuickActionsProps {
  title?: string;
  description?: string;
  actions: QuickActionItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function AdminQuickActions({
  title = 'الوصول السريع',
  description,
  actions,
  columns = 5,
  className,
}: AdminQuickActionsProps) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' };

  return (
    <Card className={cn(
      'admin-card-luxury rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader>
        <CardTitle className="admin-card-value flex items-center gap-2 font-arabic-heading text-lg">{title}</CardTitle>
        {description && <p className="admin-card-sub text-sm mt-0.5">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className={cn('grid gap-3', gridCols[columns])}>
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} prefetch className="group">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3.5 px-4 border-slate-200 dark:border-slate-600 bg-white dark:bg-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 font-medium"
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm truncate flex-1 text-right">{item.label}</span>
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
