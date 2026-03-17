'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ShortcutItem {
  keys: string[];
  description: string;
}

export interface AdminShortcutHintProps {
  shortcuts?: ShortcutItem[];
  className?: string;
}

const defaultShortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'K'], description: 'فتح البحث السريع' },
  { keys: ['Ctrl', 'S'], description: 'حفظ' },
  { keys: ['Esc'], description: 'إغلاق النافذة' },
];

export function AdminShortcutHint({ shortcuts = defaultShortcuts, className }: AdminShortcutHintProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">اختصارات لوحة المفاتيح</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {shortcuts.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-1.5">
              <span className="text-sm text-slate-600 dark:text-slate-400">{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
