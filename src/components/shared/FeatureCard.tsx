'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FeatureCard({ title, description, icon: Icon, href, className, children }: FeatureCardProps) {
  const content = (
    <Card className={cn('h-full transition-all hover:shadow-lg hover:border-primary/20', className)}>
      <CardHeader>
        {Icon && (
          <div className="mb-2 w-fit rounded-xl bg-primary/10 p-3">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
  if (href) return <a href={href} className="block h-full" dir="auto">{content}</a>;
  return <div dir="auto">{content}</div>;
}
