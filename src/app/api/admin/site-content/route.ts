import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { getSiteContent, setSiteContent, resetSiteContent } from '@/lib/site-content-store';
import { loadSiteContentFromDb, saveSiteContentToDb, DATABASE_URL_MESSAGE } from '@/lib/site-content-db';

function isDatabaseUrlError(err: unknown): boolean {
  const msg = (err as Error)?.message ?? '';
  return (err as Error & { code?: string })?.code === 'DATABASE_URL_NOT_SET' || /DATABASE_URL|Environment variable not found/i.test(msg);
}

/**
 * إدارة محتوى الموقع من لوحة التحكم.
 * التعديلات تُطبّق فوراً على الموقع مع revalidatePath.
 */
export async function GET() {
  try {
    const fromDb = await loadSiteContentFromDb();
    if (fromDb) setSiteContent(fromDb);
    const content = getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching site content:', error);
    const message = isDatabaseUrlError(error) ? DATABASE_URL_MESSAGE : 'Failed to fetch site content';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = setSiteContent(body);
    await saveSiteContentToDb(updated);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating site content:', error);
    const msg = isDatabaseUrlError(error) ? DATABASE_URL_MESSAGE : ((error as Error).message || 'فشل الاتصال بقاعدة البيانات');
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    if (action === 'reset') {
      const content = resetSiteContent();
      await saveSiteContentToDb(content).catch(() => {});
      revalidatePath('/');
      return NextResponse.json(content);
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in site content action:', error);
    const message = isDatabaseUrlError(error) ? DATABASE_URL_MESSAGE : 'Failed to perform action';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
