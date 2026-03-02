/**
 * مواقع العرض (الـ 14 موقعاً) — من Prisma مع fallback لـ data/websites عند الفراغ.
 */
import { db } from '@/lib/db';
import { listWebsites, type AdminWebsite } from '@/data/websites';

function parseJson<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

function toApiWebsite(row: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  technologies: string | null;
  images: string | null;
  badges: string | null;
  tags: string | null;
  featured: boolean;
  status: string;
  client: string | null;
  hidden: boolean;
  displayOrder: number;
}) {
  return {
    id: row.slug,
    title: row.title,
    description: row.description ?? '',
    url: row.url,
    category: row.category,
    technologies: parseJson<string[]>(row.technologies, []),
    images: parseJson<string[]>(row.images, []),
    badges: parseJson<string[]>(row.badges, []),
    tags: parseJson<string[]>(row.tags, []),
    featured: row.featured,
    status: row.status,
    client: row.client ?? 'CIAR',
    hidden: row.hidden,
    displayOrder: row.displayOrder,
  };
}

export type DisplayWebsiteApi = ReturnType<typeof toApiWebsite>;

function mapDataWebsiteToApi(w: ReturnType<typeof listWebsites>[number]) {
  return {
    id: w.id,
    title: w.title,
    description: w.description ?? '',
    url: w.url,
    category: w.category,
    technologies: w.technologies ?? [],
    images: w.images ?? [],
    badges: w.badges ?? [],
    tags: w.tags ?? [],
    featured: (w as AdminWebsite & { featured?: boolean }).featured ?? false,
    status: (w as AdminWebsite & { status?: string }).status ?? 'active',
    client: (w as AdminWebsite & { client?: string }).client ?? 'CIAR',
    hidden: w.hidden ?? false,
    displayOrder: w.displayOrder,
  };
}

export async function listDisplayWebsites(options?: { includeHidden?: boolean }): Promise<DisplayWebsiteApi[]> {
  try {
    const rows = await db.displayWebsite.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    if (rows.length > 0) {
      const list = rows.map(toApiWebsite);
      return options?.includeHidden ? list : list.filter((w) => !w.hidden);
    }
  } catch {
    // قاعدة البيانات غير متوفرة أو جدول display_websites غير موجود — نستخدم البيانات من الملف
  }
  const fromData = listWebsites(options);
  return fromData.map(mapDataWebsiteToApi);
}

export async function createDisplayWebsite(data: Partial<DisplayWebsiteApi> & { title: string; url: string; category: string }) {
  const count = await db.displayWebsite.count();
  const slug = (data.id as string) || data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `site-${Date.now()}`;
  const created = await db.displayWebsite.create({
    data: {
      slug,
      title: data.title,
      description: data.description ?? null,
      url: data.url,
      category: data.category,
      technologies: data.technologies ? JSON.stringify(data.technologies) : null,
      images: data.images ? JSON.stringify(data.images) : null,
      badges: data.badges ? JSON.stringify(data.badges) : null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      featured: data.featured ?? false,
      status: data.status ?? 'active',
      client: data.client ?? null,
      hidden: data.hidden ?? false,
      displayOrder: data.displayOrder ?? count + 1,
    },
  });
  return toApiWebsite(created);
}

export async function updateDisplayWebsite(id: string, data: Partial<DisplayWebsiteApi>) {
  const existing = await db.displayWebsite.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!existing) return null;
  const updated = await db.displayWebsite.update({
    where: { id: existing.id },
    data: {
      ...(data.title != null && { title: data.title }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.url != null && { url: data.url }),
      ...(data.category != null && { category: data.category }),
      ...(data.technologies !== undefined && { technologies: data.technologies ? JSON.stringify(data.technologies) : null }),
      ...(data.images !== undefined && { images: data.images ? JSON.stringify(data.images) : null }),
      ...(data.badges !== undefined && { badges: data.badges ? JSON.stringify(data.badges) : null }),
      ...(data.tags !== undefined && { tags: data.tags ? JSON.stringify(data.tags) : null }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.status != null && { status: data.status }),
      ...(data.client !== undefined && { client: data.client || null }),
      ...(data.hidden !== undefined && { hidden: data.hidden }),
      ...(data.displayOrder != null && { displayOrder: data.displayOrder }),
    },
  });
  return toApiWebsite(updated);
}

export async function removeDisplayWebsite(id: string): Promise<boolean> {
  const existing = await db.displayWebsite.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!existing) return false;
  await db.displayWebsite.delete({ where: { id: existing.id } });
  return true;
}
