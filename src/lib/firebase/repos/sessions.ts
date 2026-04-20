import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type SessionDoc = {
  id: string
  token: string
  userId: string
  expiresAt: string
  createdAt: string
}

function toSessionDoc(id: string, data: Record<string, unknown>): SessionDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const expiresAt = toDate(data.expiresAt)?.toISOString() || createdAt
  return {
    id,
    token: String(data.token || ''),
    userId: String(data.userId || ''),
    expiresAt,
    createdAt,
  }
}

export const sessionsRepo = {
  async create(userId: string, ttlMs: number) {
    const db = requireFirestore()
    const token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + ttlMs)
    const ref = db.collection(FIRESTORE_COLLECTIONS.sessions).doc()
    await ref.set({
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
    })
    return { token, expiresAt }
  },

  async findByToken(token: string) {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.sessions)
      .where('token', '==', token)
      .limit(1)
      .get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return toSessionDoc(doc.id, doc.data())
  },

  async deleteByToken(token: string) {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.sessions)
      .where('token', '==', token)
      .get()
    if (snapshot.empty) return
    const batch = db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
  },

  async cleanupExpired() {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.sessions)
      .where('expiresAt', '<=', new Date().toISOString())
      .get()
    if (snapshot.empty) return 0
    const batch = db.batch()
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()
    return snapshot.size
  },
}
