'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AdminTooltipWrapperProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function AdminTooltipWrapper({ children, content, side = 'top', className }: AdminTooltipWrapperProps) {
  return (
    <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            'bg-slate-800 border-amber-900/30 text-amber-200/90 text-sm',
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
  );
}
