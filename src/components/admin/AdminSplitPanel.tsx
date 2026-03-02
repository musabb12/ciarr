'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AdminSplitPanelProps {
  left: ReactNode;
  right: ReactNode;
  defaultRatio?: number; // 0-1, left percentage
  minLeft?: number;
  minRight?: number;
  className?: string;
}

export function AdminSplitPanel({
  left,
  right,
  defaultRatio = 0.5,
  minLeft = 200,
  minRight = 200,
  className,
}: AdminSplitPanelProps) {
  const [ratio, setRatio] = useState(defaultRatio);

  return (
    <div className={cn('flex w-full overflow-hidden rounded-xl border border-amber-900/20 bg-slate-800/50', className)}>
      <div
        className="overflow-auto shrink-0"
        style={{ width: `${ratio * 100}%`, minWidth: minLeft }}
      >
        {left}
      </div>
      <div
        className="w-1 bg-amber-900/30 hover:bg-amber-600/40 cursor-col-resize shrink-0 transition-colors group"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startR = ratio;
          const onMove = (moveE: MouseEvent) => {
            const delta = (moveE.clientX - startX) / window.innerWidth;
            const newR = Math.max(0.1, Math.min(0.9, startR - delta));
            setRatio(newR);
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        }}
      >
        <div className="w-1 h-full bg-amber-500/30 group-hover:bg-amber-500/60" />
      </div>
      <div
        className="flex-1 overflow-auto min-w-0"
        style={{ minWidth: minRight }}
      >
        {right}
      </div>
    </div>
  );
}
