'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AdminCopyButton } from './AdminCopyButton';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export function AdminCodeBlock({ code, language = 'text', title, className }: AdminCodeBlockProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">{title ?? language}</span>
        </div>
        <AdminCopyButton text={code} />
      </CardHeader>
      <CardContent>
        <pre className="text-xs font-mono overflow-auto max-h-48 p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-700">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
