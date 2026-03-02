'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface VideoEmbedProps {
  src: string;
  title?: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

export function VideoEmbed({ src, title = 'فيديو', className, aspectRatio = '16/9' }: VideoEmbedProps) {
  const ratioClass = aspectRatio === '16/9' ? 'aspect-video' : aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-square';
  return (
    <div className={cn('overflow-hidden rounded-lg', ratioClass, className)}>
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
