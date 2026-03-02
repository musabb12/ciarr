import { NextRequest, NextResponse } from 'next/server';

/**
 * رفع ملف - واجهة مؤقتة تعيد نجاحاً بدون تخزين فعلي.
 * لتفعيل التخزين يمكن ربطها بمجلد أو خدمة تخزين لاحقاً.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 });
    }
    // إرجاع معرف وهمي حتى تعمل واجهة الوسائط بدون خطأ
    return NextResponse.json({
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      path: '/uploads/' + file.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}
