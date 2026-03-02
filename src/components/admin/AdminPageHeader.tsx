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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-arabic-heading tracking-tight">
          {title}
        </h1>
        {description && <p className="text-amber-200/80 mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
