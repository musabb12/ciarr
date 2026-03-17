import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const fallbackImages = [
  {
    url: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'قاعة اجتماعات شركات فاخرة',
  },
  {
    url: 'https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'فريق عمل في مكتب حديث',
  },
  {
    url: 'https://images.pexels.com/photos/5668835/pexels-photo-5668835.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'شاشة تحليلات وأرقام مالية',
  },
  {
    url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'اجتماع رسمي حول طاولة بيضاوية',
  },
  {
    url: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'أفق مدينة أعمال عند الغروب',
  },
  {
    url: 'https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'مكاتب عمل أنيقة بإضاءة طبيعية',
  },
  {
    url: 'https://images.pexels.com/photos/1181351/pexels-photo-1181351.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'بيئة عمل تقنية حديثة',
  },
  {
    url: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'منظر أبراج تجارية زجاجية',
  },
  {
    url: 'https://images.pexels.com/photos/5668870/pexels-photo-5668870.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'مركز تحكم وتحليلات رقمية',
  },
  {
    url: 'https://images.pexels.com/photos/811198/pexels-photo-811198.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'ردهة استقبال شركة فاخرة',
  },
];

export async function GET() {
  try {
    const rows = await db.backgroundImage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    // نستخدم فقط الصور الحقيقية (روابط كاملة)، ونتجاهل الروابط القديمة مثل /header-bg-*.jpg
    const realImages = rows.filter((row) => {
      const url = String(row.url ?? '').trim();
      return url && (url.startsWith('http://') || url.startsWith('https://'));
    });

    if (realImages.length > 0) {
      return NextResponse.json(realImages);
    }

    // إذا لم توجد صور في القاعدة، نقوم بزرع (seed) الخلفيات الافتراضية مرة واحدة في الجدول
    if (rows.length === 0) {
      await db.backgroundImage.createMany({
        data: fallbackImages.map((img, idx) => ({
          url: img.url,
          title: img.title,
          active: true,
          sortOrder: idx + 1,
        })),
        skipDuplicates: true,
      });

      const seeded = await db.backgroundImage.findMany({
        orderBy: { sortOrder: 'asc' },
      });
      return NextResponse.json(seeded);
    }
  } catch (error) {
    console.error('Error fetching background images:', error);
  }
  // fallback أخير فقط لو فشل كل شيء (لن تُكتب في DB)
  return NextResponse.json(
    fallbackImages.map((img, idx) => ({
      id: `fallback-${idx + 1}`,
      url: img.url,
      title: img.title,
      active: true,
      sortOrder: idx + 1,
      createdAt: null,
      updatedAt: null,
    }))
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.url) return NextResponse.json({ error: 'url is required' }, { status: 400 });
    const count = await db.backgroundImage.count();
    const created = await db.backgroundImage.create({
      data: {
        url: String(body.url),
        title: body.title ? String(body.title) : null,
        active: body.active !== false,
        sortOrder: body.order ?? count + 1,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error uploading background image:', error);
    return NextResponse.json({ error: 'Failed to upload background image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const exists = await db.backgroundImage.findUnique({ where: { id: String(id) } });
    if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const updated = await db.backgroundImage.update({
      where: { id: String(id) },
      data: {
        ...(rest.url !== undefined && { url: String(rest.url) }),
        ...(rest.title !== undefined && { title: rest.title ? String(rest.title) : null }),
        ...(rest.active !== undefined && { active: Boolean(rest.active) }),
        ...(rest.order !== undefined && { sortOrder: Number(rest.order) }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating background image:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await db.backgroundImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting background image:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}