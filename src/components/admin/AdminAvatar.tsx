'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminAvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AdminAvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: AdminAvatarStatus;
  className?: string;
}

const sizeStyles = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
const statusStyles: Record<AdminAvatarStatus, string> = {
  online: 'bg-emerald-500 ring-emerald-500/50',
  offline: 'bg-slate-500 ring-slate-500/30',
  away: 'bg-amber-500 ring-amber-500/50',
  busy: 'bg-red-500 ring-red-500/50',
};

function getInitials(name?: string) {
  if (!name?.trim()) return '؟';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

export function AdminAvatar({ src, alt, name, size = 'md', status, className }: AdminAvatarProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-xl overflow-hidden flex items-center justify-center',
          'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20',
          sizeStyles[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name || ''} className="w-full h-full object-cover" />
        ) : (
          <span className="text-amber-400 font-semibold text-sm">
            {getInitials(name)}
          </span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900',
            statusStyles[status]
          )}
        />
      )}
    </div>
  );
}
