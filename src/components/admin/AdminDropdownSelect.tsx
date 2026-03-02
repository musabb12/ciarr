'use client';

import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface AdminDropdownSelectProps {
  value: string;
  options: DropdownSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdminDropdownSelect({
  value,
  options,
  onChange,
  placeholder = 'اختر...',
  className,
}: AdminDropdownSelectProps) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-between gap-2 h-9 min-w-[140px] border-amber-900/30 text-amber-200/90 hover:bg-amber-900/20',
            className
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className="w-4 h-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] bg-slate-800/95 border-amber-900/30">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'focus:bg-amber-900/30 focus:text-amber-200 cursor-pointer',
              opt.value === value && 'bg-amber-900/20 text-amber-300'
            )}
          >
            {opt.icon && <span className="ml-2">{opt.icon}</span>}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
