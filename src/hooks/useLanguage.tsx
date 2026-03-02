'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languages, translations, getDirection } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ar;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    try {
      const savedLanguage = (typeof localStorage !== 'undefined' && localStorage.getItem('language')) as Language | null;
      if (savedLanguage && languages[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    } catch {
      // localStorage غير متاح (مثلاً وضع خاص)
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('language', lang);
    } catch {
      // تجاهل إذا localStorage غير متاح
    }
    document.documentElement.dir = getDirection(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial direction and lang
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const dir = getDirection(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}