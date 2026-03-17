'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CacheEntry {
  key: string;
  size?: string;
  ttl?: string;
}

export interface AdminCacheStatusProps {
  entries?: CacheEntry[];
  totalSize?: string;
  onClear?: () => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  className?: string;
}

export function AdminCacheStatus({
  entries = [],
  totalSize = '—',
  onClear,
  onRefresh,
  className,
}: AdminCacheStatusProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">حالة الكاش</span>
        </div>
        <div className="flex gap-1">
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh} className="text-slate-600 dark:text-slate-400">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {onClear && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-red-600 dark:text-red-400">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">الحجم التقريبي: <strong className="text-slate-700 dark:text-slate-300">{totalSize}</strong></p>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {entries.length ? entries.slice(0, 8).map((e, i) => (
            <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/50">
              {e.key} {e.size && <span className="opacity-75">({e.size})</span>}
            </div>
          )) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">لا توجد مفاتيح كاش أو غير متاح</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
