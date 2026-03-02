'use client';

import * as React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export interface SocialLinkItem {
  type: keyof typeof icons;
  href: string;
  label?: string;
}

export interface SocialLinksProps {
  items: SocialLinkItem[];
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ items, className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {items.map((item) => {
        const Icon = icons[item.type];
        if (!Icon) return null;
        return (
          <a
            key={item.type}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
            aria-label={item.label ?? item.type}
          >
            <Icon className={cn('h-5 w-5', iconClassName)} />
          </a>
        );
      })}
    </div>
  );
}
