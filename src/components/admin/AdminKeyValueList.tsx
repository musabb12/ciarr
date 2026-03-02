'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface KeyValueItem {
  key: string;
  value: ReactNode;
}

export interface AdminKeyValueListProps {
  items: KeyValueItem[];
  className?: string;
}

export function AdminKeyValueList({ items, className }: AdminKeyValueListProps) {
  return (
    <dl className={cn('space-y-3', className)} dir="rtl">
      {items.map((item) => (
        <div key={item.key} className="flex justify-between gap-4 py-2 border-b border-amber-900/10 last:border-0">
          <dt className="text-sm text-amber-200/80 font-medium shrink-0">{item.key}</dt>
          <dd className="text-sm text-slate-300 text-left min-w-0">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
