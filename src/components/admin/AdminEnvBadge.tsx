'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type EnvType = 'production' | 'staging' | 'development' | 'test';

export interface AdminEnvBadgeProps {
  env?: EnvType | string;
  className?: string;
}

const envConfig: Record<string, { label: string; className: string }> = {
  production: { label: 'إنتاج', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40' },
  staging: { label: 'تجريبي', className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40' },
  development: { label: 'تطوير', className: 'bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/40' },
  test: { label: 'اختبار', className: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/40' },
};

export function AdminEnvBadge({ env = 'development', className }: AdminEnvBadgeProps) {
  const config = envConfig[env] ?? envConfig.development;
  return (
    <Badge variant="outline" className={cn('font-medium', config.className, className)}>
      {config.label}
    </Badge>
  );
}
