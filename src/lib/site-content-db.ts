/**
 * تخزين محتوى الموقع في قاعدة البيانات (جدول Setting) أو ملف JSON كنسخة احتياطية.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { SiteContent } from './site-content-store';
import { settingsRepo } from '@/lib/firebase/repos';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site-content.json');

export const FIREBASE_CONFIG_MESSAGE =
  'إعدادات Firebase غير مكتملة. أضف FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY و FIREBASE_STORAGE_BUCKET.'

export async function loadSiteContentFromDb(): Promise<SiteContent | null> {
  try {
    const value = await settingsRepo.getValue('site_content');
    const row = value ? { value } : null;
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

/** يحفظ المحتوى في ملف محلي (نسخة احتياطية عند فشل DB) */
async function saveContentToFile(json: string): Promise<void> {
  try {
    const dir = path.dirname(CONTENT_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CONTENT_FILE, json, 'utf-8');
  } catch (e) {
    console.error('site-content file write:', e);
  }
}

export async function saveSiteContentToDb(content: SiteContent): Promise<void> {
  const json = JSON.stringify(content, null, 2);
  try {
    await settingsRepo.setValue('site_content', json, 'content', 'json');
  } catch (e) {
    console.error('site-content db write:', e);
    await saveContentToFile(json);
    const message = (e as Error)?.message || ''
    if (/Firebase is not configured/i.test(message)) {
      throw new Error(FIREBASE_CONFIG_MESSAGE)
    }
    throw e
  }
  await saveContentToFile(json);
}
