import { NextResponse } from 'next/server';
import { newsRepo } from '@/lib/firebase/repos';

/** واجهة عامة للقراءة فقط: إرجاع الأخبار النشطة للشريط الإخباري في الصفحة الرئيسية */
export async function GET() {
  try {
    const list = await newsRepo.listActive();
    return NextResponse.json(
      list.map((n) => ({
        id: n.id,
        text: n.text,
        icon: n.icon ?? undefined,
        active: n.active,
      }))
    );
  } catch (error) {
    console.error('Error fetching public news:', error);
    return NextResponse.json([], { status: 200 });
  }
}
