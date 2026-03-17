'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Webhook, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WebhookLogEntry {
  id: string;
  event: string;
  url: string;
  status: number;
  at: string;
}

export interface AdminWebhookLogProps {
  entries?: WebhookLogEntry[];
  className?: string;
}

const sampleEntries: WebhookLogEntry[] = [
  { id: '1', event: 'order.created', url: 'https://api.example.com/webhook', status: 200, at: 'منذ 5 دقائق' },
  { id: '2', event: 'user.updated', url: 'https://api.example.com/webhook', status: 200, at: 'منذ 12 دقيقة' },
  { id: '3', event: 'payment.failed', url: 'https://api.example.com/webhook', status: 500, at: 'منذ 25 دقيقة' },
];

export function AdminWebhookLog({ entries = sampleEntries, className }: AdminWebhookLogProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Webhook className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">سجل الويب هوك</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{e.event}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{e.url}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500">{e.at}</span>
                {e.status >= 200 && e.status < 300 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
