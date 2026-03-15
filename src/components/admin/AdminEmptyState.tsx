'use client';

import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-amber-900/30 bg-slate-50 dark:bg-slate-800/30 backdrop-blur-sm text-center',
        'hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300',
        className
      )}
    >
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 p-5 mb-5">
        <Icon className="w-12 h-12 text-slate-600 dark:text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 font-arabic-heading">{title}</h3>
      {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm">{description}</p>}
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-all"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
