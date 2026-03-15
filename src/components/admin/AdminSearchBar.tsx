'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClear?: boolean;
}

export function AdminSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'بحث...',
  className,
  showClear = true,
}: AdminSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) onSubmit(value);
  };

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <Search className="absolute right-3 w-4 h-4 text-[#475569] dark:text-amber-500/70 pointer-events-none" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-10 pl-10 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-amber-900/30 text-[#0f172a] dark:text-slate-100 placeholder:text-[#64748b] dark:placeholder:text-slate-500 focus-visible:ring-[#1e3a8a] dark:focus-visible:ring-amber-500/50 focus-visible:border-[#1e40af] dark:focus-visible:border-amber-500/40 rounded-lg"
        dir="rtl"
      />
      {showClear && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2 h-7 w-7 text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-200"
          onClick={() => onChange('')}
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      {onSubmit && (
        <Button
          type="button"
          size="sm"
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shrink-0 shadow-lg shadow-amber-900/30 rounded-lg"
          onClick={() => onSubmit(value)}
        >
          بحث
        </Button>
      )}
    </div>
  );
}
