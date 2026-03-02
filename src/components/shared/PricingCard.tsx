'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({
  name,
  description,
  price,
  period,
  features,
  ctaText,
  ctaHref,
  onCtaClick,
  highlighted,
  className,
}: PricingCardProps) {
  const footer = (
    <CardFooter className="pt-4">
      {ctaHref ? (
        <Button asChild className="w-full" variant={highlighted ? 'default' : 'outline'}>
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      ) : (
        <Button className="w-full" variant={highlighted ? 'default' : 'outline'} onClick={onCtaClick}>
          {ctaText}
        </Button>
      )}
    </CardFooter>
  );
  return (
    <Card className={cn('flex h-full flex-col', highlighted && 'border-primary shadow-lg ring-2 ring-primary/20', className)}>
      <CardHeader>
        <h3 className="text-xl font-bold">{name}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {period && <span className="text-muted-foreground text-sm">/ {period}</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            {f.included ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Check className="h-3 w-3" />
              </span>
            ) : (
              <span className="text-muted-foreground h-5 w-5 rounded-full border" />
            )}
            <span className={f.included ? 'text-sm' : 'text-muted-foreground text-sm line-through'}>{f.text}</span>
          </div>
        ))}
      </CardContent>
      {footer}
    </Card>
  );
}
