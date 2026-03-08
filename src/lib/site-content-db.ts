/**
 * تخزين محتوى الموقع في قاعدة البيانات (جدول Setting) أو ملف JSON كنسخة احتياطية.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { SiteContent } from './site-content-store';
import { db } from '@/lib/db';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');

/** رسالة واضحة عند غياب DATABASE_URL (مثلاً على Netlify) */
export const DATABASE_URL_MESSAGE =
  'قاعدة البيانات غير مضبوطة. أضف المتغير DATABASE_URL في Netlify: Site configuration → Environment variables ثم أعد النشر (Deploy).';

function ensureDatabaseUrl(): void {
  if (!process.env.DATABASE_URL?.trim()) {
    const e = new Error(DATABASE_URL_MESSAGE) as Error & { code?: string };
    e.code = 'DATABASE_URL_NOT_SET';
    throw e;
  }
}

export async function loadSiteContentFromDb(): Promise<SiteContent | null> {
  try {
    const row = await db.setting.findUnique({ where: { key: 'site_content' } });
    if (row?.value) return JSON.parse(row.value) as SiteContent;
  } catch {
    // قاعدة البيانات غير متوفرة
  }
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

export async function saveSiteContentToDb(content: SiteContent): Promise<void> {
  ensureDatabaseUrl();
  const json = JSON.stringify(content, null, 2);
  try {
    await db.setting.upsert({
      where: { key: 'site_content' },
      create: { key: 'site_content', value: json, type: 'json', group: 'content' },
      update: { value: json },
    });
  } catch (e) {
    console.error('site-content db write:', e);
    throw e;
  }
  try {
    const dir = path.dirname(CONTENT_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CONTENT_FILE, json, 'utf-8');
  } catch (e) {
    console.error('site-content file write:', e);
  }
}
