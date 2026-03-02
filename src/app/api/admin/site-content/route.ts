import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { getSiteContent, setSiteContent, resetSiteContent } from '@/lib/site-content-store';
import { loadSiteContentFromDb, saveSiteContentToDb } from '@/lib/site-content-db';

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
    return NextResponse.json(
      { error: 'Failed to fetch site content' },
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
    return NextResponse.json(
      { error: String((error as Error).message) },
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
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
