'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AdminPagination({ page, totalPages, onPageChange, className }: AdminPaginationProps) {
  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('ellipsis');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (page < totalPages - 2) pages.push('ellipsis');
    if (totalPages > 1) pages.push(totalPages);
  }

  return (
    <nav className={cn('flex items-center gap-1', className)} dir="rtl" aria-label="ترقيم الصفحات">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg text-amber-200/80 hover:bg-amber-900/20 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-slate-500">…</span>
          ) : (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              className={cn(
                'h-9 w-9 rounded-lg font-medium',
                p === page
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-200'
              )}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg text-amber-200/80 hover:bg-amber-900/20 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    </nav>
  );
}
