'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; layout: number },
          element: string
        ) => void;
      };
      googleTranslateElementInit?: () => void;
    };
  }
}

const GOOGLE_TRANSLATE_LAYOUT = 0; // InlineLayout.SIMPLE

/**
 * Loads Google Translate script and inits the widget.
 * Place a div with id="google_translate_element" where you want the dropdown.
 */
export function GoogleTranslateWidget() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || typeof window === 'undefined') return;

    // منع تعديل DOM قبل hydration: نحمّل سكربت جوجل بعد تحميل React.
    // كذلك نضمن وجود googtrans حسب كوكي language.
    try {
      const langMatch = document.cookie.match(/(?:^|;\s*)language=([^;]+)/);
      const lang = langMatch ? decodeURIComponent(langMatch[1]) : '';
      if (lang === 'en' || lang === 'fr') {
        document.cookie = `googtrans=/ar/${lang}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        document.cookie = `googtrans=/ar/ar; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }

    window.googleTranslateElementInit = function () {
      if (window.google?.translate && document.getElementById('google_translate_element')) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'ar',
            includedLanguages: 'ar,en,fr',
            layout: GOOGLE_TRANSLATE_LAYOUT,
          },
          'google_translate_element'
        );
      }
    };

    const id = 'google-translate-script';
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;

    return () => {
      const s = document.getElementById(id);
      if (s?.parentNode) s.parentNode.removeChild(s);
    };
  }, []);

  return (
    <div id="google_translate_element" className="sr-only" aria-hidden />
  );
}
