import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/** واجهة عامة للقراءة فقط: إرجاع الأخبار النشطة للشريط الإخباري في الصفحة الرئيسية */
export async function GET() {
  try {
    const list = await db.newsItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
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
