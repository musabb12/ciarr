import { NextRequest, NextResponse } from 'next/server';
import { contactsRepo } from '@/lib/firebase/repos';

function mapStatus(s: string) {
  return contactsRepo.normalizeStatus(s);
}

function toApiMessage(m: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
}) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone ?? undefined,
    subject: m.subject,
    message: m.message,
    status: m.status.toLowerCase(),
    notes: m.notes ?? undefined,
    createdAt: new Date(m.createdAt).toISOString(),
    priority: m.status === 'NEW' ? 'high' : 'medium',
  };
}

export async function GET() {
  try {
    const list = await contactsRepo.listAll();
    return NextResponse.json(list.map(toApiMessage));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'name, email, subject and message are required' },
        { status: 400 }
      );
    }
    const created = await contactsRepo.create({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : null,
      subject: String(subject),
      message: String(message),
      status: 'NEW',
    });
    if (!created) {
      return NextResponse.json({ error: 'Failed to create contact message' }, { status: 500 });
    }
    return NextResponse.json(toApiMessage(created), { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to create contact message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const data: { status?: string; notes?: string | null } = {};
    if (status != null) data.status = mapStatus(String(status));
    if (notes !== undefined) data.notes = notes ? String(notes) : null;
    const updated = await contactsRepo.update(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(toApiMessage(updated));
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    await contactsRepo.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}