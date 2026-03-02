'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizes[size], className)}
      aria-label="جاري التحميل"
    />
  );
}

export function LoadingOverlay({ message = 'جاري التحميل...', className }: { message?: string; className?: string }) {
  return (
    <div
      className={cn(
        'bg-background/80 flex flex-col items-center justify-center gap-3 rounded-lg p-8',
        className
      )}
    >
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
