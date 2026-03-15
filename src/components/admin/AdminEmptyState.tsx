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
        'hover:border-amber-300 dark:hover:border-amber-700/40 hover:bg-amber-50/50 dark:hover:bg-slate-800/40 transition-all duration-300',
        className
      )}
    >
      <div className="rounded-2xl bg-amber-100 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-amber-600/10 border border-amber-200 dark:border-amber-500/20 p-5 mb-5">
        <Icon className="w-12 h-12 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 font-arabic-heading">{title}</h3>
      {description && <p className="text-sm text-slate-600 dark:text-amber-200/90 mt-2 max-w-sm">{description}</p>}
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 border-amber-400 text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-600/20 font-medium transition-all"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
