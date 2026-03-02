'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminLoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export function AdminLoadingOverlay({ visible, message = 'جاري التحميل...', className }: AdminLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-800/90 backdrop-blur-sm border border-amber-900/30 px-8 py-6 shadow-2xl shadow-black/30">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
        <p className="text-sm font-medium text-slate-300">{message}</p>
      </div>
    </div>
  );
}
