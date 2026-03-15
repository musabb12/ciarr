'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AdminBreadcrumb({ items, className }: AdminBreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} dir="rtl" aria-label="مسار التنقل">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronLeft className="w-4 h-4 text-amber-500/50 rotate-180" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-amber-600 dark:text-amber-200/90 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-slate-800 dark:text-slate-100 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
