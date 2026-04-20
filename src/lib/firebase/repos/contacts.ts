import crypto from 'crypto'
import { FIRESTORE_COLLECTIONS, FirestoreContactStatus } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type ContactDoc = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: FirestoreContactStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

function normalizeStatus(status?: string): FirestoreContactStatus {
  const value = String(status || 'NEW').toUpperCase()
  if (value === 'READ') return 'READ'
  if (value === 'REPLIED') return 'REPLIED'
  if (value === 'CLOSED') return 'CLOSED'
  return 'NEW'
}

function toContactDoc(id: string, data: Record<string, unknown>): ContactDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt
  return {
    id,
    name: String(data.name || ''),
    email: String(data.email || ''),
    phone: data.phone ? String(data.phone) : null,
    subject: String(data.subject || ''),
    message: String(data.message || ''),
    status: normalizeStatus(String(data.status || 'NEW')),
    notes: data.notes ? String(data.notes) : null,
    createdAt,
    updatedAt,
  }
}

export const contactsRepo = {
  normalizeStatus,

  async listAll() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.contacts).orderBy('createdAt', 'desc').get()
    return snapshot.docs.map((doc) => toContactDoc(doc.id, doc.data()))
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.contacts).count().get()
    return snapshot.data().count
  },

  async countBetween(start: Date, end?: Date) {
    const db = requireFirestore()
    const ref = db
      .collection(FIRESTORE_COLLECTIONS.contacts)
      .where('createdAt', '>=', start.toISOString())
    const snapshot = end
      ? await ref.where('createdAt', '<', end.toISOString()).count().get()
      : await ref.count().get()
    return snapshot.data().count
  },

  async create(data: {
    name: string
    email: string
    phone?: string | null
    subject: string
    message: string
    status?: FirestoreContactStatus
    notes?: string | null
  }) {
    const db = requireFirestore()
    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    await db.collection(FIRESTORE_COLLECTIONS.contacts).doc(id).set({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject,
      message: data.message,
      status: data.status ?? 'NEW',
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.contacts).doc(id).get()
    if (!doc.exists) return null
    return toContactDoc(doc.id, doc.data() || {})
  },

  async update(id: string, data: { status?: string; notes?: string | null }) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.contacts).doc(id).set(
      {
        ...(data.status !== undefined && { status: normalizeStatus(data.status) }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    return this.findById(id)
  },

  async remove(id: string) {
    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.contacts).doc(id).delete()
  },
}
