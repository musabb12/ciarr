'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languages, translations, getDirection } from '@/lib/i18n';

/** يقرأ لغة ترجمة جوجل من كوكي googtrans (مثلاً /ar/en => en) */
function getLanguageFromGoogleTranslateCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/googtrans=\/([^/]+)\/([^;]+)/);
  if (!match) return null;
  const target = match[2];
  if (target === 'ar' || target === 'en' || target === 'fr') return target;
  return null;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ar;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function setLanguageCookie(lang: Language) {
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch {
    // تجاهل
  }
}

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage?: string | null }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage === 'en' || initialLanguage === 'fr') return initialLanguage;
    return 'ar';
  });

  useEffect(() => {
    try {
      const savedLanguage = (typeof localStorage !== 'undefined' && localStorage.getItem('language')) as Language | null;
      if (savedLanguage && languages[savedLanguage]) {
        setLanguageState(savedLanguage);
        setLanguageCookie(savedLanguage);
        return;
      }
      const fromGoogle = getLanguageFromGoogleTranslateCookie();
      if (fromGoogle) {
        setLanguageState(fromGoogle);
        if (typeof localStorage !== 'undefined') localStorage.setItem('language', fromGoogle);
        setLanguageCookie(fromGoogle);
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
    setLanguageCookie(lang);
    document.documentElement.dir = getDirection(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;
  }, [language]);

  // مزامنة الاتجاه عند استخدام ترجمة جوجل من الويدجت
  useEffect(() => {
    const interval = setInterval(() => {
      const fromGoogle = getLanguageFromGoogleTranslateCookie();
      if (fromGoogle && fromGoogle !== language) {
        setLanguageState(fromGoogle);
        if (typeof localStorage !== 'undefined') localStorage.setItem('language', fromGoogle);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [language]);

  // المحتوى دائماً بالعربية ليقوم جوجل بترجمته؛ language للاتجاه والعرض في القائمة فقط
  const t = translations.ar;
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