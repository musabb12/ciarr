import { NextRequest, NextResponse } from 'next/server';
import { servicesRepo } from '@/lib/firebase/repos';

function toApiService(s: { id: string; title: string; description: string | null; icon: string; active: boolean; sortOrder: number }) {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? '',
    icon: s.icon,
    active: s.active,
    order: s.sortOrder,
  };
}

export async function GET() {
  try {
    const list = await servicesRepo.listAll();
    return NextResponse.json(list.map(toApiService));
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await servicesRepo.count();
    const created = await servicesRepo.create({
      title: body.title ?? 'خدمة جديدة',
      description: body.description ?? null,
      icon: body.icon ?? 'FileText',
      active: body.active !== false,
      sortOrder: count + 1,
    });
    if (!created) {
      return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
    return NextResponse.json(toApiService(created), { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: 'Service id is required' }, { status: 400 });
    }
    const data: { title?: string; description?: string | null; icon?: string; active?: boolean; sortOrder?: number } = {};
    if (updateData.title != null) data.title = String(updateData.title);
    if (updateData.description !== undefined) data.description = updateData.description ? String(updateData.description) : null;
    if (updateData.icon != null) data.icon = String(updateData.icon);
    if (updateData.active !== undefined) data.active = Boolean(updateData.active);
    if (updateData.order != null) data.sortOrder = Number(updateData.order);
    const updated = await servicesRepo.update(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(toApiService(updated));
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Service id is required' }, { status: 400 });
    }
    await servicesRepo.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
