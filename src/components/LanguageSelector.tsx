'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { languages, Language } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';

/** يفعّل ترجمة جوجل: يكتب كوكي googtrans ويعيد التحميل لترجمة الصفحة فعلياً بـ Google */
function switchToGoogleTranslateLanguage(lang: Language) {
  if (typeof document === 'undefined') return;
  const googtrans = lang === 'ar' ? '/ar/ar' : `/ar/${lang}`;
  document.cookie = `googtrans=${googtrans}; path=/; max-age=31536000; SameSite=Lax`;
  document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  try {
    localStorage.setItem('language', lang);
  } catch {
    // تجاهل
  }
  window.location.reload();
}

type LanguageSelectorProps = {
  className?: string;
};

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang: Language) => {
    setIsOpen(false);
    if (lang === language) return;
    switchToGoogleTranslateLanguage(lang);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 shrink-0 h-9 ${className}`}
      >
        <Globe className="w-4 h-4" />
        <span>{languages[language].flag}</span>
        <span className="hidden sm:inline">{languages[language].name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px]">
          {Object.entries(languages).map(([lang, config]) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang as Language)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2 space-x-reverse ${
                language === lang ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''
              }`}
            >
              <span>{config.flag}</span>
              <span>{config.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}