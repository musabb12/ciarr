'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { languages, Language } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';

type LanguageSelectorProps = {
  className?: string;
};

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          {Object.entries(languages).map(([lang, config]) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang as Language);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2 space-x-reverse ${
                language === lang ? 'bg-gray-100 font-semibold' : ''
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