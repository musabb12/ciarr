import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type ServiceDoc = {
  id: string
  title: string
  description: string | null
  icon: string
  active: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

function toServiceDoc(id: string, data: Record<string, unknown>): ServiceDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt
  return {
    id,
    title: String(data.title || ''),
    description: data.description ? String(data.description) : null,
    icon: String(data.icon || 'FileText'),
    active: data.active !== false,
    sortOrder: Number(data.sortOrder || 1),
    createdAt,
    updatedAt,
  }
}

export const servicesRepo = {
  async listAll() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.services).orderBy('sortOrder', 'asc').get()
    return snapshot.docs.map((doc) => toServiceDoc(doc.id, doc.data()))
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.services).count().get()
    return snapshot.data().count
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.services).doc(id).get()
    if (!doc.exists) return null
    return toServiceDoc(doc.id, doc.data() || {})
  },

  async create(data: { title: string; description?: string | null; icon?: string; active?: boolean; sortOrder: number }) {
    const db = requireFirestore()
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    await db.collection(FIRESTORE_COLLECTIONS.services).doc(id).set({
      title: data.title,
      description: data.description ?? null,
      icon: data.icon ?? 'FileText',
      active: data.active !== false,
      sortOrder: data.sortOrder,
      createdAt: now,
      updatedAt: now,
    })
    return this.findById(id)
  },

  async update(
    id: string,
    data: { title?: string; description?: string | null; icon?: string; active?: boolean; sortOrder?: number }
  ) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.services).doc(id).set(
      {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.icon !== undefined && { icon: data.icon }),
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
    await db.collection(FIRESTORE_COLLECTIONS.services).doc(id).delete()
  },
}
