import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const logs = await db.systemLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(
      logs.map((l) => ({
        id: l.id,
        action: l.action,
        user: l.user ?? undefined,
        ip: l.ip ?? undefined,
        timestamp: l.createdAt.toISOString(),
        status: l.status as 'success' | 'warning' | 'error' | string,
        details: l.details ?? undefined,
      }))
    );
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return NextResponse.json({ error: 'Failed to fetch system logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
    const newLog = await db.systemLog.create({
      data: {
        action: String(body.action),
        user: body.user ? String(body.user) : null,
        ip: body.ip ? String(body.ip) : null,
        status: body.status ? String(body.status) : 'success',
        details: body.details ? String(body.details) : null,
      },
    });

    return NextResponse.json(
      {
        id: newLog.id,
        action: newLog.action,
        user: newLog.user ?? undefined,
        ip: newLog.ip ?? undefined,
        status: newLog.status,
        timestamp: newLog.createdAt.toISOString(),
        details: newLog.details ?? undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating system log:', error);
    return NextResponse.json({ error: 'Failed to create system log' }, { status: 500 });
  }
}