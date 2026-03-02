import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/user-auth';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapUser(u: {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}) {
  return {
    id: u.id,
    name: u.name ?? '—',
    email: u.email,
    role: u.role.toLowerCase(),
    status: u.isActive ? 'active' : 'inactive',
    joinDate: u.createdAt.toISOString(),
    lastLogin: u.lastLogin ? u.lastLogin.toISOString() : null,
  };
}

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users.map(mapUser));
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : '';
    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 });

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'email already exists' }, { status: 409 });

    const plainPassword =
      typeof body.password === 'string' && body.password.length >= 6
        ? body.password
        : randomBytes(6).toString('hex');
    const hashed = hashPassword(plainPassword);

    const created = await db.user.create({
      data: {
        email,
        name: body.name ? String(body.name) : null,
        password: hashed,
        role: String(body.role || 'USER').toUpperCase(),
        isActive: body.status ? String(body.status).toLowerCase() === 'active' : true,
        lastLogin: new Date(),
      },
    });

    return NextResponse.json(
      { ...mapUser(created), generatedPassword: body.password ? undefined : plainPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 });

    const data: any = {};
    if (rest.name !== undefined) data.name = rest.name ? String(rest.name) : null;
    if (rest.email !== undefined) data.email = String(rest.email).trim().toLowerCase();
    if (rest.role !== undefined) data.role = String(rest.role).toUpperCase();
    if (rest.status !== undefined) data.isActive = String(rest.status).toLowerCase() === 'active';
    if (rest.lastLogin !== undefined) data.lastLogin = rest.lastLogin ? new Date(rest.lastLogin) : null;
    if (password) data.password = hashPassword(String(password));

    const updated = await db.user.update({
      where: { id: String(id) },
      data,
    });

    return NextResponse.json(mapUser(updated));
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 });
    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}