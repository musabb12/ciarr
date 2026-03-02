'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorAvatar,
  rating = 5,
  className,
}: TestimonialCardProps) {
  const initials = authorName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="p-6">
        <Quote className="text-muted-foreground/50 mb-2 h-8 w-8" />
        <p className="text-foreground mb-4 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
        {rating > 0 && (
          <div className="mb-3 flex gap-0.5" aria-label={`التقييم: ${rating} من 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? 'text-amber-500' : 'text-muted-foreground/40'} aria-hidden>★</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{authorName}</p>
            {authorRole && <p className="text-muted-foreground text-xs">{authorRole}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
