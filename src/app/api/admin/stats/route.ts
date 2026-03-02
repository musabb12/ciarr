import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function calcGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function GET() {
  try {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);
    const prev30 = new Date(now);
    prev30.setDate(now.getDate() - 60);

    const [
      totalUsers,
      activeUsers,
      totalTemplates,
      totalMessages,
      totalNews,
      totalServices,
      messagesLast30,
      messagesPrev30,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.displayWebsite.count(),
      db.contactMessage.count(),
      db.newsItem.count(),
      db.siteService.count(),
      db.contactMessage.count({ where: { createdAt: { gte: last30 } } }),
      db.contactMessage.count({ where: { createdAt: { gte: prev30, lt: last30 } } }),
    ]);

    const monthlyGrowth = Number(calcGrowth(messagesLast30, messagesPrev30).toFixed(1));

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalTemplates,
      totalMessages,
      totalRevenue: 0,
      monthlyGrowth,
      totalNews,
      totalServices,
      messagesLast30,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}