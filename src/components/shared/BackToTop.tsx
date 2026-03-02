'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface BackToTopProps {
  className?: string;
  showAfter?: number;
  label?: string;
}

export function BackToTop({ className, showAfter = 400, label = 'العودة للأعلى' }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn('fixed bottom-6 left-6 z-40 rounded-full shadow-lg', className)}
      aria-label={label}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
