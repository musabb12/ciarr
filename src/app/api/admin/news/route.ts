import { NextRequest, NextResponse } from 'next/server';
import { newsRepo } from '@/lib/firebase/repos';

function toApiItem(n: { id: string; text: string; icon: string | null; active: boolean; priority: string; createdAt: string }) {
  return {
    id: n.id,
    text: n.text,
    icon: n.icon ?? undefined,
    active: n.active,
    priority: n.priority,
    createdAt: new Date(n.createdAt).toISOString().split('T')[0],
  };
}

export async function GET() {
  try {
    const list = await newsRepo.listAll();
    return NextResponse.json(list.map(toApiItem));
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newNews = await newsRepo.create({
      text: body.text ?? 'خبر جديد',
      icon: body.icon ?? null,
      active: body.active !== false,
      priority: body.priority ?? 'medium',
    });
    if (!newNews) {
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }
    return NextResponse.json(toApiItem(newNews), { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) {
      return NextResponse.json({ error: 'News id is required' }, { status: 400 });
    }
    const updated = await newsRepo.update(id, {
      ...(rest.text != null && { text: String(rest.text) }),
      ...(rest.icon !== undefined && { icon: rest.icon ? String(rest.icon) : null }),
      ...(rest.active !== undefined && { active: Boolean(rest.active) }),
      ...(rest.priority != null && { priority: String(rest.priority) }),
    });
    if (!updated) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(toApiItem(updated));
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'News id is required' }, { status: 400 });
    }
    await newsRepo.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}