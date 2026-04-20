/**
 * مواقع العرض (الـ 14 موقعاً) — من Prisma مع fallback لـ data/websites عند الفراغ.
 */
import { websitesRepo } from '@/lib/firebase/repos';
import { listWebsites, type AdminWebsite } from '@/data/websites';

function parseJson<T>(s: unknown, fallback: T): T {
  if (!s) return fallback;
  if (Array.isArray(s)) return s as T;
  try {
    return JSON.parse(String(s)) as T;
  } catch {
    return fallback;
  }
}

function toApiWebsite(row: {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
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
    titleEn: row.titleEn ?? '',
    description: row.description ?? '',
    descriptionEn: row.descriptionEn ?? '',
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
    titleEn: (w as any).titleEn ?? '',
    description: w.description ?? '',
    descriptionEn: (w as any).descriptionEn ?? '',
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
    const rows = await websitesRepo.list({ includeHidden: true });
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
  const count = await websitesRepo.count();
  const created = await websitesRepo.create({
    id: data.id as string | undefined,
    slug:
      (data.id as string) ||
      data.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ||
      `site-${Date.now()}`,
    title: data.title,
    titleEn: data.titleEn ?? null,
    description: data.description ?? null,
    descriptionEn: data.descriptionEn ?? null,
    url: data.url,
    category: data.category,
    technologies: data.technologies ?? [],
    images: data.images ?? [],
    badges: data.badges ?? [],
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    status: data.status ?? 'active',
    client: data.client ?? null,
    hidden: data.hidden ?? false,
    displayOrder: data.displayOrder ?? count + 1,
  });
  if (!created) {
    throw new Error('Failed to create website')
  }
  return toApiWebsite(created);
}

export async function updateDisplayWebsite(id: string, data: Partial<DisplayWebsiteApi>) {
  const existing = await websitesRepo.findByIdOrSlug(id);
  if (!existing) return null;
  const updated = await websitesRepo.update(existing.id, {
    ...(data.title != null && { title: data.title }),
    ...(data.titleEn !== undefined && { titleEn: data.titleEn || null }),
    ...(data.description !== undefined && { description: data.description || null }),
    ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn || null }),
    ...(data.url != null && { url: data.url }),
    ...(data.category != null && { category: data.category }),
    ...(data.technologies !== undefined && { technologies: data.technologies ?? [] }),
    ...(data.images !== undefined && { images: data.images ?? [] }),
    ...(data.badges !== undefined && { badges: data.badges ?? [] }),
    ...(data.tags !== undefined && { tags: data.tags ?? [] }),
    ...(data.featured !== undefined && { featured: data.featured }),
    ...(data.status != null && { status: data.status }),
    ...(data.client !== undefined && { client: data.client || null }),
    ...(data.hidden !== undefined && { hidden: data.hidden }),
    ...(data.displayOrder != null && { displayOrder: data.displayOrder }),
  });
  if (!updated) return null
  return toApiWebsite(updated);
}

export async function removeDisplayWebsite(id: string): Promise<boolean> {
  return websitesRepo.remove(id);
}
