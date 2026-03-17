'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HealthEndpoint {
  name: string;
  url?: string;
  status?: 'ok' | 'error' | 'pending';
  latency?: number;
}

export interface AdminApiHealthCheckProps {
  endpoints?: HealthEndpoint[];
  onCheck?: () => Promise<HealthEndpoint[]>;
  className?: string;
}

export function AdminApiHealthCheck({
  endpoints = [],
  onCheck,
  className,
}: AdminApiHealthCheckProps) {
  const [items, setItems] = useState<HealthEndpoint[]>(endpoints);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      if (onCheck) {
        const result = await onCheck();
        setItems(result);
      } else {
        setItems([
          { name: 'الواجهة الأمامية', status: 'ok', latency: 12 },
          { name: 'واجهة API', status: 'ok', latency: 45 },
          { name: 'قاعدة البيانات', status: 'ok', latency: 8 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoints.length) setItems(endpoints);
  }, [endpoints]);

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="admin-card-title text-sm font-semibold">صحة الخدمات</span>
        <Button variant="ghost" size="sm" onClick={runCheck} disabled={loading} className="text-slate-600 dark:text-slate-400">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((ep, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300">{ep.name}</span>
            <div className="flex items-center gap-2">
              {ep.latency != null && (
                <span className="text-xs text-slate-500 dark:text-slate-400">{ep.latency} ms</span>
              )}
              {ep.status === 'ok' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              {ep.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
              {ep.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
