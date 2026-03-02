'use client';

import * as React from 'react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface NotificationBannerProps {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variants = {
  info: 'bg-blue-500/10 text-blue-800 dark:text-blue-200 border-blue-500/30',
  success: 'bg-green-500/10 text-green-800 dark:text-green-200 border-green-500/30',
  warning: 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/30',
  error: 'bg-red-500/10 text-red-800 dark:text-red-200 border-red-500/30',
};

export function NotificationBanner({
  message,
  variant = 'info',
  dismissible = true,
  onDismiss,
  className,
}: NotificationBannerProps) {
  const [hidden, setHidden] = useState(false);

  const handleDismiss = () => {
    setHidden(true);
    onDismiss?.();
  };

  if (hidden) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border px-4 py-3',
        variants[variant],
        className
      )}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
      {dismissible && (
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="shrink-0" aria-label="إغلاق">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
