import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
import { getSiteContent, setSiteContent, resetSiteContent } from '@/lib/site-content-store';
import { loadSiteContentFromDb, saveSiteContentToDb, DATABASE_URL_MESSAGE } from '@/lib/site-content-db';

function isDatabaseUrlError(err: unknown): boolean {
  const msg = (err as Error)?.message ?? '';
  return (err as Error & { code?: string })?.code === 'DATABASE_URL_NOT_SET' || /DATABASE_URL|Environment variable not found/i.test(msg);
}

/** رسالة عند فشل مصادقة قاعدة البيانات (كلمة مرور أو مستخدم خاطئ) */
const DB_AUTH_ERROR_MESSAGE =
  'فشل الاتصال بقاعدة البيانات: بيانات الدخول غير صحيحة. تأكد من أن DATABASE_URL يستخدم كلمة مرور قاعدة البيانات من Supabase (الإعدادات → Database → Database password) وليس كلمة مرور حسابك. إن استمر الخطأ أنشئ مستخدم prisma من SQL Editor كما في توثيق Supabase.';

function isDatabaseAuthError(err: unknown): boolean {
  const msg = (err as Error)?.message ?? '';
  return /Authentication failed|credentials.*not valid|password authentication failed/i.test(msg);
}

/** قاطع الدائرة مفتوح بسبب كثرة أخطاء المصادقة — يجب الانتظار ثم تصحيح DATABASE_URL */
const DB_CIRCUIT_BREAKER_MESSAGE =
  'قاعدة البيانات أوقفت المحاولات مؤقتاً بسبب كثرة أخطاء تسجيل الدخول. انتظر 15–30 دقيقة ثم صحّح كلمة مرور قاعدة البيانات في DATABASE_URL (من Supabase → Project Settings → Database) وجرب الحفظ مرة واحدة. تجنب الضغط على «حفظ» مرات متكررة قبل تصحيح الإعدادات.';

function isCircuitBreakerError(err: unknown): boolean {
  const msg = (err as Error)?.message ?? '';
  return /Circuit breaker|circuit breaker|قاطع الدائرة|too many.*auth|too many.*authentication/i.test(msg);
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
    let msg = (error as Error)?.message || 'فشل الاتصال بقاعدة البيانات';
    if (isDatabaseUrlError(error)) msg = DATABASE_URL_MESSAGE;
    else if (isCircuitBreakerError(error)) msg = DB_CIRCUIT_BREAKER_MESSAGE;
    else if (isDatabaseAuthError(error)) msg = DB_AUTH_ERROR_MESSAGE;
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
