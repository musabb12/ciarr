'use client';

import { cn } from '@/lib/utils';

export interface AdminSkeletonLoaderProps {
  variant?: 'text' | 'avatar' | 'card' | 'table' | 'stat';
  className?: string;
}

export function AdminSkeletonLoader({ variant = 'text', className }: AdminSkeletonLoaderProps) {
  if (variant === 'text') {
    return <div className={cn('h-4 rounded bg-slate-700/60 animate-pulse', className)} />;
  }
  if (variant === 'avatar') {
    return <div className={cn('rounded-xl bg-slate-700/60 animate-pulse', className || 'w-12 h-12')} />;
  }
  if (variant === 'stat') {
    return (
      <div className={cn('space-y-3 p-5 rounded-xl bg-slate-800/50 border border-amber-900/20', className)}>
        <div className="h-4 w-24 rounded bg-slate-700/60 animate-pulse" />
        <div className="h-8 w-16 rounded bg-slate-700/60 animate-pulse" />
      </div>
    );
  }
  if (variant === 'card') {
    return (
      <div className={cn('space-y-4 p-6 rounded-xl bg-slate-800/50 border border-amber-900/20', className)}>
        <div className="h-5 w-1/2 rounded bg-slate-700/60 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-700/60 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-slate-700/60 animate-pulse" />
          <div className="h-4 w-3/5 rounded bg-slate-700/60 animate-pulse" />
        </div>
      </div>
    );
  }
  if (variant === 'table') {
    return (
      <div className={cn('space-y-0', className)}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-amber-900/20">
            <div className="h-4 flex-1 rounded bg-slate-700/60 animate-pulse" />
            <div className="h-4 w-24 rounded bg-slate-700/60 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-700/60 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }
  return null;
}
