import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type SystemLogDoc = {
  id: string
  action: string
  user: string | null
  ip: string | null
  status: string
  details: string | null
  createdAt: string
}

function toSystemLogDoc(id: string, data: Record<string, unknown>): SystemLogDoc {
  return {
    id,
    action: String(data.action || ''),
    user: data.user ? String(data.user) : null,
    ip: data.ip ? String(data.ip) : null,
    status: String(data.status || 'success'),
    details: data.details ? String(data.details) : null,
    createdAt: toDate(data.createdAt)?.toISOString() || new Date().toISOString(),
  }
}

export const logsRepo = {
  async list(limit = 200) {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.logs)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
    return snapshot.docs.map((doc) => toSystemLogDoc(doc.id, doc.data()))
  },

  async create(data: { action: string; user?: string | null; ip?: string | null; status?: string; details?: string | null }) {
    const db = requireFirestore()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    await db.collection(FIRESTORE_COLLECTIONS.logs).doc(id).set({
      action: data.action,
      user: data.user ?? null,
      ip: data.ip ?? null,
      status: data.status ?? 'success',
      details: data.details ?? null,
      createdAt: now,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.logs).doc(id).get()
    if (!doc.exists) return null
    return toSystemLogDoc(doc.id, doc.data() || {})
  },
}
