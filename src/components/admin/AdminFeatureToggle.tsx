'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeatureFlag {
  key: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export interface AdminFeatureToggleProps {
  features: FeatureFlag[];
  onToggle?: (key: string, enabled: boolean) => void;
  className?: string;
}

export function AdminFeatureToggle({ features, onToggle, className }: AdminFeatureToggleProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">مفاتيح الميزات</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((f) => (
          <div key={f.key} className="flex items-center justify-between py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <div>
              <Label className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.label}</Label>
              {f.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.description}</p>
              )}
            </div>
            <Switch
              checked={f.enabled}
              onCheckedChange={(checked) => onToggle?.(f.key, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
