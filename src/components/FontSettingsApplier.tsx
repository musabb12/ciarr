'use client';

import { useEffect } from 'react';

/**
 * يقرأ إعدادات الخطوط من API ويطبّقها على عنصر html ليعمل في كامل الموقع.
 * يُستخدم في الـ layout الرئيسي حتى تُطبَّق الخطوط في كل الصفحات.
 */
export function FontSettingsApplier() {
  useEffect(() => {
    let cancelled = false;
    const root = document.documentElement;

    const apply = (data: { fontSettings?: { heading?: string; body?: string; modern?: string } }) => {
      if (cancelled) return;
      const fs = data?.fontSettings;
      if (fs) {
        if (fs.heading) root.dataset.fontHeading = fs.heading;
        if (fs.body) root.dataset.fontBody = fs.body;
        if (fs.modern) root.dataset.fontModern = fs.modern;
      } else {
        root.removeAttribute('data-font-heading');
        root.removeAttribute('data-font-body');
        root.removeAttribute('data-font-modern');
      }
    };

    fetch('/api/site-content', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && apply(data))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
