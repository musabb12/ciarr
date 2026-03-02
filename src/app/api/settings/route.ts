import { NextResponse } from 'next/server';
import { getSiteSettings, getDefaultSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * واجهة عامة لقراءة إعدادات الموقع. لا تتطلب صلاحيات أدمن.
 */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings (using defaults):', error);
    return NextResponse.json(getDefaultSiteSettings());
  }
}
