'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MarqueeTextProps {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  className?: string;
}

export function MarqueeText({ children, pauseOnHover = true, className }: MarqueeTextProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max gap-8 animate-scroll-rtl',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
