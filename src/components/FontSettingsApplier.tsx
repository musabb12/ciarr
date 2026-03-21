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

    const apply = (data: {
      fontSettings?: {
        heading?: string;
        body?: string;
        modern?: string;
        headingSize?: 'sm' | 'md' | 'lg';
        bodySize?: 'sm' | 'md' | 'lg';
        headingWeight?: 'normal' | 'semibold' | 'bold';
        bodyWeight?: 'normal' | 'medium';
        lineHeight?: 'relaxed' | 'normal' | 'tight';
        letterSpacing?: 'normal' | 'wide' | 'tight';
      };
    }) => {
      if (cancelled) return;
      const fs = data?.fontSettings;
      if (fs) {
        if (fs.heading) root.dataset.fontHeading = fs.heading;
        if (fs.body) root.dataset.fontBody = fs.body;
        if (fs.modern) root.dataset.fontModern = fs.modern;
        if (fs.headingSize) root.dataset.fontHeadingSize = fs.headingSize;
        if (fs.bodySize) root.dataset.fontBodySize = fs.bodySize;
        if (fs.headingWeight) root.dataset.fontHeadingWeight = fs.headingWeight;
        if (fs.bodyWeight) root.dataset.fontBodyWeight = fs.bodyWeight;
        if (fs.lineHeight) root.dataset.fontLineHeight = fs.lineHeight;
        if (fs.letterSpacing) root.dataset.fontLetterSpacing = fs.letterSpacing;
      } else {
        root.removeAttribute('data-font-heading');
        root.removeAttribute('data-font-body');
        root.removeAttribute('data-font-modern');
        root.removeAttribute('data-font-heading-size');
        root.removeAttribute('data-font-body-size');
        root.removeAttribute('data-font-heading-weight');
        root.removeAttribute('data-font-body-weight');
        root.removeAttribute('data-font-line-height');
        root.removeAttribute('data-font-letter-spacing');
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
