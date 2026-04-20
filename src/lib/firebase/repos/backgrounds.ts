import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type BackgroundDoc = {
  id: string
  url: string
  title: string | null
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

function toBackgroundDoc(id: string, data: Record<string, unknown>): BackgroundDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt
  return {
    id,
    url: String(data.url || ''),
    title: data.title ? String(data.title) : null,
    active: data.active !== false,
    sortOrder: Number(data.sortOrder || 1),
    createdAt,
    updatedAt,
  }
}

export const backgroundsRepo = {
  async listAll() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.backgrounds).orderBy('sortOrder', 'asc').get()
    return snapshot.docs.map((doc) => toBackgroundDoc(doc.id, doc.data()))
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.backgrounds).count().get()
    return snapshot.data().count
  },

  async create(data: { url: string; title?: string | null; active?: boolean; sortOrder: number }) {
    const db = requireFirestore()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    await db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc(id).set({
      url: data.url,
      title: data.title ?? null,
      active: data.active !== false,
      sortOrder: data.sortOrder,
      createdAt: now,
      updatedAt: now,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc(id).get()
    if (!doc.exists) return null
    return toBackgroundDoc(doc.id, doc.data() || {})
  },

  async update(id: string, data: { url?: string; title?: string | null; active?: boolean; sortOrder?: number }) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc(id).set(
      {
        ...(data.url !== undefined && { url: data.url }),
        ...(data.title !== undefined && { title: data.title ?? null }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    return this.findById(id)
  },

  async remove(id: string) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc(id).delete()
  },

  async seedIfEmpty(items: Array<{ url: string; title: string }>) {
    const current = await this.listAll()
    if (current.length > 0) return current
    const db = requireFirestore()
    const now = new Date().toISOString()
    const batch = db.batch()
    items.forEach((item, index) => {
      const ref = db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc()
      batch.set(ref, {
        url: item.url,
        title: item.title,
        active: true,
        sortOrder: index + 1,
        createdAt: now,
        updatedAt: now,
      })
    })
    await batch.commit()
    return this.listAll()
  },
}
