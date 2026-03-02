/**
 * الأخبار (NewsItem) — طبقة مركزية
 */

import { db } from '@/lib/db';

export async function listActiveNews() {
  return db.newsItem.findMany({
    where: { active: true },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function listAllNews() {
  return db.newsItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
