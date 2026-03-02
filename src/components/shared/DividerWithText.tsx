'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerWithTextProps {
  text: string;
  className?: string;
}

export function DividerWithText({ text, className }: DividerWithTextProps) {
  return (
    <div className={cn('flex w-full items-center gap-4', className)}>
      <span className="bg-border h-px flex-1" />
      <span className="text-muted-foreground text-sm font-medium">{text}</span>
      <span className="bg-border h-px flex-1" />
    </div>
  );
}
