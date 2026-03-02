'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  targetDate: Date | string;
  onComplete?: () => void;
  className?: string;
  labels?: { days: string; hours: string; minutes: string; seconds: string };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className,
  labels = { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية' },
}: CountdownTimerProps) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const total = Math.max(0, target.getTime() - now.getTime());
      if (total <= 0) {
        setDone(true);
        onComplete?.();
        return;
      }
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 60000) % 60);
      const hours = Math.floor((total / 3600000) % 24);
      const days = Math.floor(total / 86400000);
      setDiff({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  if (done) {
    return (
      <div className={cn('text-center text-muted-foreground text-sm', className)}>
        انتهى العد التنازلي
      </div>
    );
  }

  const items = [
    { value: diff.days, label: labels.days },
    { value: diff.hours, label: labels.hours },
    { value: diff.minutes, label: labels.minutes },
    { value: diff.seconds, label: labels.seconds },
  ];

  return (
    <div className={cn('flex flex-wrap justify-center gap-3 sm:gap-4', className)} dir="ltr">
      {items.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-muted flex h-14 w-14 min-w-14 items-center justify-center rounded-xl border text-xl font-bold sm:h-16 sm:w-16 sm:min-w-16 sm:text-2xl">
            {pad(value)}
          </div>
          <span className="text-muted-foreground mt-1 text-xs font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
