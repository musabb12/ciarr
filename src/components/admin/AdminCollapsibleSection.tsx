'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminCollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AdminCollapsibleSection({
  title,
  children,
  defaultOpen = true,
  className,
}: AdminCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-right text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors"
      >
        <span className="font-medium">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 pt-0">{children}</div>}
    </div>
  );
}
