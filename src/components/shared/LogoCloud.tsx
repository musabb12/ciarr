'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoItem {
  name: string;
  logo: string;
  href?: string;
}

export interface LogoCloudProps {
  title?: string;
  items: LogoItem[];
  className?: string;
  grayscale?: boolean;
}

export function LogoCloud({ title, items, className, grayscale = true }: LogoCloudProps) {
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="text-muted-foreground mb-6 text-center text-sm font-medium">{title}</h3>}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {items.map((item) => {
          const img = (
            <Image
              key={item.name}
              src={item.logo}
              alt={item.name}
              width={120}
              height={48}
              className={cn('h-8 w-auto object-contain', grayscale && 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0')}
            />
          );
          if (item.href) {
            return (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                {img}
              </a>
            );
          }
          return <div key={item.name} className="flex items-center">{img}</div>;
        })}
      </div>
    </div>
  );
}
