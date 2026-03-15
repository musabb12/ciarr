'use client';

import { useState, useEffect, useCallback } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandPaletteItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  keywords?: string[];
  action: () => void;
}

export interface AdminCommandPaletteProps {
  items: CommandPaletteItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
}

export function AdminCommandPalette({
  items,
  open,
  onOpenChange,
  placeholder = 'ابحث أو نفّذ أمراً...',
}: AdminCommandPaletteProps) {
  const [search, setSearch] = useState('');

  const runAction = useCallback(
    (item: CommandPaletteItem) => {
      item.action();
      onOpenChange(false);
      setSearch('');
    },
    [onOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 max-w-2xl bg-slate-900/98 backdrop-blur-xl border-amber-900/30 overflow-hidden"
        dir="rtl"
      >
        <Command className="rounded-none border-0">
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="h-12 bg-transparent border-b border-slate-600 text-slate-200 placeholder:text-slate-500 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
            <CommandGroup heading="أوامر سريعة">
              {items
                .filter(
                  (item) =>
                    item.label.toLowerCase().includes(search.toLowerCase()) ||
                    item.keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))
                )
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => runAction(item)}
                      className="text-slate-200 focus:bg-slate-700/50 focus:text-slate-100 cursor-pointer"
                    >
                      {Icon && <Icon className="w-4 h-4 ml-2 shrink-0 text-slate-400" />}
                      {item.label}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
