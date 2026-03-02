'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  className,
  imageClassName,
  priority,
}: ImageWithCaptionProps) {
  return (
    <figure className={cn('overflow-hidden rounded-lg', className)}>
      <div className={cn('relative overflow-hidden rounded-lg', imageClassName)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">{caption}</figcaption>
      )}
    </figure>
  );
}
