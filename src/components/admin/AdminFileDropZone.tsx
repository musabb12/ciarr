'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminFileDropZoneProps {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function AdminFileDropZone({
  accept = 'image/*,.pdf',
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  onFiles,
  className,
}: AdminFileDropZoneProps) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<File[]>([]);

  const validate = useCallback(
    (files: File[]) => {
      setError(null);
      if (files.length > maxFiles) {
        setError(`الحد الأقصى ${maxFiles} ملفات`);
        return [];
      }
      const valid: File[] = [];
      for (const f of files) {
        if (f.size > maxSize) {
          setError(`الملف ${f.name} أكبر من ${Math.round(maxSize / 1024 / 1024)} ميجا`);
          continue;
        }
        valid.push(f);
      }
      return valid;
    },
    [maxFiles, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const files = Array.from(e.dataTransfer.files);
      const valid = validate(files);
      if (valid.length) {
        setSelected((prev) => [...prev, ...valid].slice(0, maxFiles));
        onFiles?.(valid);
      }
    },
    [validate, maxFiles, onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const valid = validate(files);
      if (valid.length) {
        setSelected((prev) => [...prev, ...valid].slice(0, maxFiles));
        onFiles?.(valid);
      }
      e.target.value = '';
    },
    [validate, maxFiles, onFiles]
  );

  const remove = (index: number) => setSelected((prev) => prev.filter((_, i) => i !== index));

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardContent className="pt-6">
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-colors',
            drag ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
          )}
        >
          <Upload className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">اسحب الملفات هنا أو انقر للاختيار</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">الحد الأقصى {maxFiles} ملفات، {Math.round(maxSize / 1024 / 1024)} ميجا لكل ملف</p>
          <input type="file" accept={accept} multiple className="hidden" onChange={handleChange} />
        </label>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        {selected.length > 0 && (
          <ul className="mt-4 space-y-2">
            {selected.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <File className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1">{f.name}</span>
                <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
