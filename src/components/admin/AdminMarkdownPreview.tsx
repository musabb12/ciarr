'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Eye, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="mr-4">$1</li>')
    .replace(/\n/g, '<br/>');
}

export interface AdminMarkdownPreviewProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdminMarkdownPreview({
  value = '',
  onChange,
  placeholder = 'اكتب محتوى Markdown هنا...',
  className,
}: AdminMarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const html = simpleMarkdownToHtml(value);

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">Markdown</span>
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium flex items-center gap-1',
              activeTab === 'edit' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <Code className="w-3.5 h-3.5" /> تحرير
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'px-3 py-1.5 text-xs font-medium flex items-center gap-1',
              activeTab === 'preview' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <Eye className="w-3.5 h-3.5" /> معاينة
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'edit' ? (
          <Textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="font-mono text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-sm min-h-[200px] p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
            dangerouslySetInnerHTML={{ __html: html || '<p class="text-slate-400">لا يوجد محتوى للمعاينة</p>' }}
          />
        )}
      </CardContent>
    </Card>
  );
}
