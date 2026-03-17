'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Braces, AlertTriangle } from 'lucide-react';
import { AdminCopyButton } from './AdminCopyButton';
import { cn } from '@/lib/utils';

export interface AdminJsonViewerProps {
  data: object | string;
  editable?: boolean;
  onChange?: (json: object) => void;
  className?: string;
}

export function AdminJsonViewer({
  data,
  editable = false,
  onChange,
  className,
}: AdminJsonViewerProps) {
  const initial = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const [raw, setRaw] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    if (!editable || !onChange) return;
    try {
      const parsed = JSON.parse(raw);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Braces className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">JSON</span>
        </div>
        <AdminCopyButton text={raw} />
      </CardHeader>
      <CardContent>
        {editable ? (
          <>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onBlur={handleBlur}
              rows={12}
              className="font-mono text-xs bg-slate-900 text-slate-100 border-slate-700 rounded-lg"
            />
            {error && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </>
        ) : (
          <pre className="text-xs font-mono overflow-auto max-h-64 p-4 rounded-lg bg-slate-900 text-slate-100 border border-slate-700">
            {raw}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

