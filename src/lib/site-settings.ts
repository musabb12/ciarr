/**
 * إعدادات الموقع — تخزين في قاعدة البيانات (جدول Setting) أو ملف JSON كنسخة احتياطية.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { db } from '@/lib/db';

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  announcementText: string;
  announcementVisible: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  primaryColor: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  showNewsletter: boolean;
  showTestimonials: boolean;
  openingHours: string;
  googleMapsEmbed: string;
  analyticsCode: string;
  cookieConsentText: string;
  trustBadgesText: string;
  ctaButtonText: string;
  contactFormTitle: string;
  newsletterSuccessMessage: string;
  heroBackgroundImage: string;
  enableSearch: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'CIAR',
  siteLogo: '/logo.png',
  favicon: '/favicon.png',
  contactEmail: 'info@ciar.com',
  contactPhone: '+966500000000',
  contactAddress: 'الرياض، المملكة العربية السعودية',
  whatsappNumber: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
  announcementText: '',
  announcementVisible: false,
  maintenanceMode: false,
  maintenanceMessage: 'الموقع قيد الصيانة. سنعود قريباً.',
  primaryColor: '#f59e0b',
  footerText: 'شركة CIAR — 14 موقعاً يخدمونك',
  seoTitle: 'CIAR - شركة خدمات رقمية',
  seoDescription: 'شركة CIAR تقدم خدماتها عبر 14 موقعاً إلكترونياً',
  showNewsletter: true,
  showTestimonials: true,
  openingHours: 'الأحد - الخميس: 9ص - 6م',
  googleMapsEmbed: '',
  analyticsCode: '',
  cookieConsentText: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستمرارك في التصفح فإنك توافق على ذلك.',
  trustBadgesText: 'دفع آمن | شحن سريع | ضمان الاسترداد',
  ctaButtonText: 'اكتشف المزيد',
  contactFormTitle: 'تواصل معنا',
  newsletterSuccessMessage: 'شكراً لاشتراكك في نشرتنا البريدية.',
  heroBackgroundImage: '/hero-bg.jpg',
  enableSearch: true,
};

let memoryCache: SiteSettings | null = null;

export function getDefaultSiteSettings(): SiteSettings {
  return { ...DEFAULT_SETTINGS };
}

function getFilePath() {
  return path.join(process.cwd(), 'data', 'site-settings.json');
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (memoryCache) return memoryCache;
  try {
    const row = await db.setting.findUnique({ where: { key: 'site_settings' } });
    if (row?.value) {
      const parsed = JSON.parse(row.value) as Partial<SiteSettings>;
      memoryCache = { ...DEFAULT_SETTINGS, ...parsed };
      return memoryCache;
    }
  } catch {
    // قاعدة البيانات غير متوفرة، نستخدم الملف
  }
  try {
    const filePath = getFilePath();
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    memoryCache = { ...DEFAULT_SETTINGS, ...parsed };
    return memoryCache;
  } catch {
    memoryCache = { ...DEFAULT_SETTINGS };
    return memoryCache;
  }
}

export async function setSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...settings };
  memoryCache = updated;
  try {
    await db.setting.upsert({
      where: { key: 'site_settings' },
      create: { key: 'site_settings', value: JSON.stringify(updated), type: 'json', group: 'general' },
      update: { value: JSON.stringify(updated) },
    });
  } catch (e) {
    console.error('site-settings db write:', e);
  }
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('site-settings file write:', e);
  }
  return updated;
}
