import { NextRequest, NextResponse } from 'next/server';

/**
 * قائمة الملفات - واجهة مؤقتة تعيد مصفوفة فارغة.
 * لتفعيل إدارة الوسائط فعلياً يمكن ربطها بمجلد أو قاعدة بيانات لاحقاً.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    // إرجاع مصفوفة فارغة حتى لا تفشل واجهة إدارة الوسائط
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json([], { status: 200 });
  }
}
