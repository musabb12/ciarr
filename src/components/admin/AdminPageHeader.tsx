'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] dark:text-slate-100 font-arabic-heading tracking-tight">
          {title}
        </h1>
        {description && <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
