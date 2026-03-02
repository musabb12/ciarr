'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SocialLinks, type SocialLinkItem } from './SocialLinks';

export interface TeamMemberCardProps {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  socialLinks?: SocialLinkItem[];
  className?: string;
}

export function TeamMemberCard({ name, role, bio, image, socialLinks, className }: TeamMemberCardProps) {
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Card className={cn('h-full transition-shadow hover:shadow-md', className)}>
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm">{role}</p>
      </CardHeader>
      <CardContent className="pt-0 text-center">
        {bio && <p className="text-muted-foreground mb-3 text-sm">{bio}</p>}
        {socialLinks && socialLinks.length > 0 && (
          <SocialLinks items={socialLinks} className="justify-center" />
        )}
      </CardContent>
    </Card>
  );
}
