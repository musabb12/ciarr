'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Download, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: () => void;
}

export interface AdminBulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: BulkAction[];
  className?: string;
}

export function AdminBulkActionBar({ selectedCount, onClear, actions, className }: AdminBulkActionBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          تم تحديد {selectedCount} عنصر
        </span>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-500">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        {actions.map((a) => (
          <Button
            key={a.id}
            variant={a.variant ?? 'outline'}
            size="sm"
            onClick={a.onClick}
            className="text-slate-700 dark:text-slate-300"
          >
            {a.icon ?? null}
            <span className="mr-2">{a.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
