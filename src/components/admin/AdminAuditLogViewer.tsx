'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuditLogEntry {
  id: string;
  action: string;
  user?: string;
  details?: string;
  timestamp: string;
  ip?: string;
}

export interface AdminAuditLogViewerProps {
  entries?: AuditLogEntry[];
  pageSize?: number;
  className?: string;
}

const sampleEntries: AuditLogEntry[] = [
  { id: '1', action: 'تسجيل دخول', user: 'admin@example.com', timestamp: 'منذ 5 دقائق', ip: '192.168.1.1' },
  { id: '2', action: 'تعديل المحتوى', details: 'site_content', user: 'admin@example.com', timestamp: 'منذ 12 دقيقة' },
  { id: '3', action: 'حذف عنصر', details: 'news_item:xyz', user: 'admin@example.com', timestamp: 'منذ ساعة' },
];

export function AdminAuditLogViewer({ entries = sampleEntries, pageSize = 10, className }: AdminAuditLogViewerProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = entries.filter(
    (e) =>
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      (e.user?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">سجل التدقيق</span>
        </div>
        <div className="relative w-48">
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8 text-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {filtered.slice(0, pageSize).map((e) => (
            <div key={e.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between py-2.5 px-3 text-right hover:bg-slate-100 dark:hover:bg-slate-800/50"
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.action}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{e.timestamp}</span>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400', expanded === e.id && 'rotate-180')} />
                </div>
              </button>
              {expanded === e.id && (
                <div className="px-3 pb-3 pt-0 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                  {e.user && <p>المستخدم: {e.user}</p>}
                  {e.details && <p>التفاصيل: {e.details}</p>}
                  {e.ip && <p>IP: {e.ip}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
