import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/user-auth';
import { randomBytes } from 'crypto';
import { userProfilesRepo } from '@/lib/firebase/repos';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapUser(u: {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}) {
  return {
    id: u.id,
    name: u.name ?? '—',
    email: u.email,
    role: u.role.toLowerCase(),
    status: u.isActive ? 'active' : 'inactive',
    joinDate: new Date(u.createdAt).toISOString(),
    lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : null,
  };
}

export async function GET() {
  try {
    const users = await userProfilesRepo.list();
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

    const existing = await userProfilesRepo.findByEmail(email);
    if (existing) return NextResponse.json({ error: 'email already exists' }, { status: 409 });

    const plainPassword =
      typeof body.password === 'string' && body.password.length >= 6
        ? body.password
        : randomBytes(6).toString('hex');
    const hashed = hashPassword(plainPassword);

    const created = await userProfilesRepo.create({
      email,
      password: plainPassword,
      passwordHash: hashed,
      name: body.name ? String(body.name) : null,
      role: String(body.role || 'USER').toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      isActive: body.status ? String(body.status).toLowerCase() === 'active' : true,
    });
    if (!created) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    await userProfilesRepo.update(created.id, { lastLogin: new Date().toISOString() });

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

    const data: {
      name?: string | null;
      email?: string;
      role?: 'ADMIN' | 'USER';
      isActive?: boolean;
      lastLogin?: string | null;
      password?: string;
      passwordHash?: string;
    } = {};
    if (rest.name !== undefined) data.name = rest.name ? String(rest.name) : null;
    if (rest.email !== undefined) data.email = String(rest.email).trim().toLowerCase();
    if (rest.role !== undefined) data.role = String(rest.role).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    if (rest.status !== undefined) data.isActive = String(rest.status).toLowerCase() === 'active';
    if (rest.lastLogin !== undefined) data.lastLogin = rest.lastLogin ? new Date(rest.lastLogin).toISOString() : null;
    if (password) {
      data.password = String(password);
      data.passwordHash = hashPassword(String(password));
    }

    const updated = await userProfilesRepo.update(String(id), data);
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

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
    await userProfilesRepo.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}