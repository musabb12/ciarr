'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      value={{ light: 'light', dark: 'dark' }}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="ciar-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
