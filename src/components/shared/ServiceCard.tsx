'use client';

import * as React from 'react';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  features?: string[];
  className?: string;
}

export function ServiceCard({ title, description, icon: Icon, href, features, className }: ServiceCardProps) {
  const content = (
    <Card className={cn('h-full transition-all hover:shadow-lg hover:border-primary/30', className)}>
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
        {features && features.length > 0 && (
          <ul className="text-muted-foreground mt-4 space-y-1 text-sm">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {href && (
          <a
            href={href}
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            المزيد
            <ArrowLeft className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
  if (href) return <a href={href} className="block h-full" dir="auto">{content}</a>;
  return <div dir="auto">{content}</div>;
}
