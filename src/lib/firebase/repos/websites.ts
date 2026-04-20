import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type WebsiteDoc = {
  id: string
  slug: string
  title: string
  titleEn: string | null
  description: string | null
  descriptionEn: string | null
  url: string
  category: string
  technologies: string[]
  images: string[]
  badges: string[]
  tags: string[]
  featured: boolean
  status: string
  client: string | null
  provider: string | null
  price: number | null
  demoUrl: string | null
  hidden: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item))
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map((item) => String(item))
    } catch {
      return [value]
    }
  }
  return []
}

function toWebsiteDoc(id: string, data: Record<string, unknown>): WebsiteDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt
  return {
    id,
    slug: String(data.slug || id),
    title: String(data.title || ''),
    titleEn: data.titleEn ? String(data.titleEn) : null,
    description: data.description ? String(data.description) : null,
    descriptionEn: data.descriptionEn ? String(data.descriptionEn) : null,
    url: String(data.url || ''),
    category: String(data.category || ''),
    technologies: toStringArray(data.technologies),
    images: toStringArray(data.images),
    badges: toStringArray(data.badges),
    tags: toStringArray(data.tags),
    featured: data.featured === true,
    status: String(data.status || 'active'),
    client: data.client ? String(data.client) : null,
    provider: data.provider ? String(data.provider) : null,
    price: typeof data.price === 'number' ? data.price : data.price ? Number(data.price) : null,
    demoUrl: data.demoUrl ? String(data.demoUrl) : null,
    hidden: data.hidden === true,
    displayOrder: Number(data.displayOrder || 1),
    createdAt,
    updatedAt,
  }
}

function buildSlug(raw: string) {
  const slug = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return slug || `site-${Date.now()}`
}

export const websitesRepo = {
  async list(options?: { includeHidden?: boolean }) {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.websites).orderBy('displayOrder', 'asc').get()
    const items = snapshot.docs.map((doc) => toWebsiteDoc(doc.id, doc.data()))
    return options?.includeHidden ? items : items.filter((item) => !item.hidden)
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.websites).count().get()
    return snapshot.data().count
  },

  async findByIdOrSlug(idOrSlug: string) {
    const db = requireFirestore()
    const byIdDoc = await db.collection(FIRESTORE_COLLECTIONS.websites).doc(idOrSlug).get()
    if (byIdDoc.exists) return toWebsiteDoc(byIdDoc.id, byIdDoc.data() || {})

    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.websites)
      .where('slug', '==', idOrSlug)
      .limit(1)
      .get()
    const doc = snapshot.docs[0]
    return doc ? toWebsiteDoc(doc.id, doc.data()) : null
  },

  async create(data: Partial<WebsiteDoc> & { title: string; url: string; category: string }) {
    const db = requireFirestore()
    const id = data.id || crypto.randomUUID()
    const now = new Date().toISOString()
    const displayOrder = data.displayOrder ?? (await this.count()) + 1
    const slug = data.slug || buildSlug(data.title)
    await db.collection(FIRESTORE_COLLECTIONS.websites).doc(id).set({
      slug,
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
      featured: data.featured === true,
      status: data.status ?? 'active',
      client: data.client ?? null,
      provider: data.provider ?? null,
      price: data.price ?? null,
      demoUrl: data.demoUrl ?? null,
      hidden: data.hidden === true,
      displayOrder,
      createdAt: now,
      updatedAt: now,
    })
    return this.findByIdOrSlug(id)
  },

  async update(idOrSlug: string, data: Partial<WebsiteDoc>) {
    const existing = await this.findByIdOrSlug(idOrSlug)
    if (!existing) return null
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.websites).doc(existing.id).set(
      {
        ...(data.slug !== undefined && { slug: data.slug || buildSlug(data.title || existing.title) }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.titleEn !== undefined && { titleEn: data.titleEn ?? null }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn ?? null }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.technologies !== undefined && { technologies: data.technologies }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.badges !== undefined && { badges: data.badges }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.client !== undefined && { client: data.client ?? null }),
        ...(data.provider !== undefined && { provider: data.provider ?? null }),
        ...(data.price !== undefined && { price: data.price ?? null }),
        ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl ?? null }),
        ...(data.hidden !== undefined && { hidden: data.hidden }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    return this.findByIdOrSlug(existing.id)
  },

  async remove(idOrSlug: string) {
    const existing = await this.findByIdOrSlug(idOrSlug)
    if (!existing) return false
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.websites).doc(existing.id).delete()
    return true
  },
}
