'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminColorPickerFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  className?: string;
}

const defaultPresets = ['#0f172a', '#1e293b', '#475569', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ffffff', '#f1f5f9'];

export function AdminColorPickerField({
  label = 'اللون',
  value,
  onChange,
  presets = defaultPresets,
  className,
}: AdminColorPickerFieldProps) {
  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <Label className="flex items-center gap-2 admin-card-title text-sm font-semibold">
          <Palette className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          {label}
        </Label>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent"
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-sm flex-1 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              className={cn(
                'w-6 h-6 rounded-md border-2 transition-transform hover:scale-110',
                value.toLowerCase() === c.toLowerCase() ? 'border-slate-800 dark:border-white ring-2 ring-offset-2 ring-slate-400' : 'border-slate-300 dark:border-slate-600'
              )}
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
