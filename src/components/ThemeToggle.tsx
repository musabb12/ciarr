'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ThemeValue = 'light' | 'dark' | 'system';

const labels: Record<ThemeValue, string> = {
  light: 'فاتح',
  dark: 'داكن',
  system: 'حسب النظام',
};

export function ThemeToggle({
  className = '',
  variant = 'dropdown',
  scrolled,
}: {
  className?: string;
  variant?: 'dropdown' | 'icon-only';
  scrolled?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} aria-label="الثيم">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const navStyles = scrolled !== undefined;
  const iconClass = navStyles ? (scrolled ? 'text-stone-700' : 'text-white/90') : '';
  const hoverClass = navStyles ? (scrolled ? 'hover:bg-stone-100 hover:text-stone-900' : 'hover:bg-white/10 hover:text-white') : '';

  if (variant === 'icon-only') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`${className} ${iconClass} ${hoverClass}`}
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label={resolvedTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${className} ${iconClass} ${hoverClass}`}
          aria-label="تغيير الثيم"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="font-arabic-modern" side="left">
        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
          <Sun className="h-4 w-4" />
          {labels.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
          <Moon className="h-4 w-4" />
          {labels.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
          <Monitor className="h-4 w-4" />
          {labels.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
