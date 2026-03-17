'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Server, Cpu, Globe, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminSystemInfoCardProps {
  env?: string;
  nodeVersion?: string;
  region?: string;
  uptime?: string;
  className?: string;
}

export function AdminSystemInfoCard({
  env = 'development',
  nodeVersion = process.env.NODE_ENV ?? '—',
  region = '—',
  uptime = '—',
  className,
}: AdminSystemInfoCardProps) {
  const items = [
    { icon: Server, label: 'البيئة', value: env },
    { icon: Code, label: 'Node', value: nodeVersion },
    { icon: Globe, label: 'المنطقة', value: region },
    { icon: Cpu, label: 'وقت التشغيل', value: uptime },
  ];
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <span className="admin-card-title text-sm font-semibold">معلومات النظام</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Icon className="w-4 h-4" /> {item.label}
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
