import { NextResponse } from 'next/server';
import { getSiteContent, setSiteContent } from '@/lib/site-content-store';
import { loadSiteContentFromDb } from '@/lib/site-content-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * واجهة عامة لقراءة محتوى الموقع (الصفحة الرئيسية).
 * لا تتطلب صلاحيات أدمن. تُحمّل من قاعدة البيانات مع التخزين المؤقت.
 */
export async function GET() {
  try {
    const fromDb = await loadSiteContentFromDb();
    if (fromDb) setSiteContent(fromDb);
  } catch (error) {
    console.error('Error fetching site content (using defaults):', error);
    // لا نُرجع 500 — نعتمد المحتوى الافتراضي في الذاكرة حتى يعمل الموقع دون قاعدة بيانات
  }
  const content = getSiteContent();
  return NextResponse.json(content);
}
