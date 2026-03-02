'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FilterChip {
  id: string;
  label: string;
  value?: string;
}

export interface AdminFilterChipsProps {
  chips: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function AdminFilterChips({ chips, onRemove, onClearAll, className }: AdminFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm text-amber-200/90 shadow-md"
        >
          <span>{chip.label}{chip.value ? `: ${chip.value}` : ''}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5 rounded-full p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            onClick={() => onRemove(chip.id)}
            aria-label={`إزالة فلتر ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </span>
      ))}
      {onClearAll && chips.length > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200"
          onClick={onClearAll}
        >
          مسح الكل
        </Button>
      )}
    </div>
  );
}
