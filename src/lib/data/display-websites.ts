import { db } from '@/lib/db';

export async function listDisplayWebsites(includeHidden = false) {
  return db.displayWebsite.findMany({
    where: includeHidden ? {} : { hidden: false },
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getDisplayWebsiteBySlug(slug: string) {
  return db.displayWebsite.findFirst({ where: { slug, hidden: false, status: 'active' } });
}
