import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type NewsDoc = {
  id: string
  text: string
  icon: string | null
  active: boolean
  priority: string
  createdAt: string
  updatedAt: string
}

function toNewsDoc(id: string, data: Record<string, unknown>): NewsDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt
  return {
    id,
    text: String(data.text || ''),
    icon: data.icon ? String(data.icon) : null,
    active: data.active !== false,
    priority: String(data.priority || 'medium'),
    createdAt,
    updatedAt,
  }
}

export const newsRepo = {
  async listAll() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.news).orderBy('createdAt', 'desc').get()
    return snapshot.docs.map((doc) => toNewsDoc(doc.id, doc.data()))
  },

  async listActive() {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.news)
      .where('active', '==', true)
      .orderBy('createdAt', 'desc')
      .get()
    return snapshot.docs.map((doc) => toNewsDoc(doc.id, doc.data()))
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.news).count().get()
    return snapshot.data().count
  },

  async create(data: { text: string; icon?: string | null; active?: boolean; priority?: string }) {
    const db = requireFirestore()
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    await db.collection(FIRESTORE_COLLECTIONS.news).doc(id).set({
      text: data.text,
      icon: data.icon ?? null,
      active: data.active !== false,
      priority: data.priority ?? 'medium',
      createdAt: now,
      updatedAt: now,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.news).doc(id).get()
    if (!doc.exists) return null
    return toNewsDoc(doc.id, doc.data() || {})
  },

  async update(
    id: string,
    data: { text?: string; icon?: string | null; active?: boolean; priority?: string }
  ) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.news).doc(id).set(
      {
        ...(data.text !== undefined && { text: data.text }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.priority !== undefined && { priority: data.priority }),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    return this.findById(id)
  },

  async remove(id: string) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.news).doc(id).delete()
  },
}
