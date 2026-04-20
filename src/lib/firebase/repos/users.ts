import { getAuth } from 'firebase-admin/auth'
import { FieldValue } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { FIRESTORE_COLLECTIONS, FirestoreUserRole } from '@/lib/firebase/collections'
import { requireFirestore, toDate } from '@/lib/firebase/firestore-utils'

export type UserProfileDoc = {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar: string | null
  role: FirestoreUserRole
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  passwordHash?: string | null
}

function requireAuth() {
  const app = getFirebaseAdminApp()
  if (!app) throw new Error('Firebase is not configured')
  return getAuth(app)
}

function toUserProfileDoc(id: string, data: Record<string, unknown>): UserProfileDoc {
  const createdAt = toDate(data.createdAt)?.toISOString() || new Date().toISOString()
  const updatedAt = toDate(data.updatedAt)?.toISOString() || createdAt

  return {
    id,
    email: String(data.email || ''),
    name: data.name ? String(data.name) : null,
    phone: data.phone ? String(data.phone) : null,
    avatar: data.avatar ? String(data.avatar) : null,
    role: (String(data.role || 'USER').toUpperCase() as FirestoreUserRole) === 'ADMIN' ? 'ADMIN' : 'USER',
    isActive: data.isActive !== false,
    lastLogin: toDate(data.lastLogin)?.toISOString() || null,
    createdAt,
    updatedAt,
    passwordHash: data.passwordHash ? String(data.passwordHash) : null,
  }
}

export const userProfilesRepo = {
  async list() {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.users)
      .orderBy('createdAt', 'desc')
      .get()
    return snapshot.docs.map((doc) => toUserProfileDoc(doc.id, doc.data()))
  },

  async findById(id: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.users).doc(id).get()
    if (!doc.exists) return null
    return toUserProfileDoc(doc.id, doc.data() || {})
  },

  async findByEmail(email: string) {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.users)
      .where('email', '==', email.trim().toLowerCase())
      .limit(1)
      .get()
    const doc = snapshot.docs[0]
    return doc ? toUserProfileDoc(doc.id, doc.data()) : null
  },

  async count() {
    const db = requireFirestore()
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.users).count().get()
    return snapshot.data().count
  },

  async countActive() {
    const db = requireFirestore()
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.users)
      .where('isActive', '==', true)
      .count()
      .get()
    return snapshot.data().count
  },

  async create(data: {
    email: string
    password: string
    name?: string | null
    phone?: string | null
    avatar?: string | null
    role?: FirestoreUserRole
    isActive?: boolean
    passwordHash?: string | null
  }) {
    const auth = requireAuth()
    const now = new Date().toISOString()
    const email = data.email.trim().toLowerCase()
    const role = data.role === 'ADMIN' ? 'ADMIN' : 'USER'

    const authUser = await auth.createUser({
      email,
      password: data.password,
      displayName: data.name || undefined,
      disabled: data.isActive === false,
    })
    await auth.setCustomUserClaims(authUser.uid, { role: role.toLowerCase() })

    const db = requireFirestore()
    await db.collection(FIRESTORE_COLLECTIONS.users).doc(authUser.uid).set({
      email,
      name: data.name ?? null,
      phone: data.phone ?? null,
      avatar: data.avatar ?? null,
      role,
      isActive: data.isActive !== false,
      lastLogin: null,
      passwordHash: data.passwordHash ?? null,
      createdAt: now,
      updatedAt: now,
    })

    return this.findById(authUser.uid)
  },

  async update(
    id: string,
    data: {
      email?: string
      password?: string
      name?: string | null
      phone?: string | null
      avatar?: string | null
      role?: FirestoreUserRole
      isActive?: boolean
      lastLogin?: string | null
      passwordHash?: string | null
    }
  ) {
    const auth = requireAuth()
    const authUpdate: {
      email?: string
      password?: string
      displayName?: string | null
      disabled?: boolean
    } = {}
    if (data.email !== undefined) authUpdate.email = data.email.trim().toLowerCase()
    if (data.password !== undefined) authUpdate.password = data.password
    if (data.name !== undefined) authUpdate.displayName = data.name ?? null
    if (data.isActive !== undefined) authUpdate.disabled = !data.isActive
    if (Object.keys(authUpdate).length > 0) {
      await auth.updateUser(id, authUpdate)
    }
    if (data.role !== undefined) {
      await auth.setCustomUserClaims(id, { role: data.role.toLowerCase() })
    }

    const db = requireFirestore()
    await db
      .collection(FIRESTORE_COLLECTIONS.users)
      .doc(id)
      .set(
        {
          ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
          ...(data.name !== undefined && { name: data.name ?? null }),
          ...(data.phone !== undefined && { phone: data.phone ?? null }),
          ...(data.avatar !== undefined && { avatar: data.avatar ?? null }),
          ...(data.role !== undefined && { role: data.role }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.lastLogin !== undefined && { lastLogin: data.lastLogin }),
          ...(data.passwordHash !== undefined && { passwordHash: data.passwordHash ?? null }),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )

    return this.findById(id)
  },

  async touchLastLogin(id: string) {
    const db = requireFirestore()
    const now = new Date().toISOString()
    await db.collection(FIRESTORE_COLLECTIONS.users).doc(id).set(
      {
        lastLogin: now,
        updatedAt: now,
      },
      { merge: true }
    )
  },

  async delete(id: string) {
    const auth = requireAuth()
    const db = requireFirestore()
    await Promise.allSettled([
      auth.deleteUser(id),
      db.collection(FIRESTORE_COLLECTIONS.users).doc(id).delete(),
      db.collection(FIRESTORE_COLLECTIONS.sessions).where('userId', '==', id).get().then(async (snapshot) => {
        if (snapshot.empty) return
        const batch = db.batch()
        snapshot.docs.forEach((doc) => batch.delete(doc.ref))
        await batch.commit()
      }),
    ])
  },

  async upsertProfileOnly(data: {
    id: string
    email: string
    name?: string | null
    phone?: string | null
    avatar?: string | null
    role?: FirestoreUserRole
    isActive?: boolean
    lastLogin?: string | null
    createdAt?: string
    updatedAt?: string
    passwordHash?: string | null
  }) {
    const db = requireFirestore()
    const now = new Date().toISOString()
    await db
      .collection(FIRESTORE_COLLECTIONS.users)
      .doc(data.id)
      .set(
        {
          email: data.email.trim().toLowerCase(),
          name: data.name ?? null,
          phone: data.phone ?? null,
          avatar: data.avatar ?? null,
          role: data.role ?? 'USER',
          isActive: data.isActive !== false,
          lastLogin: data.lastLogin ?? null,
          passwordHash: data.passwordHash ?? null,
          createdAt: data.createdAt ?? now,
          updatedAt: data.updatedAt ?? now,
        },
        { merge: true }
      )
    return this.findById(data.id)
  },

  async incrementCounter(field: string, by = 1) {
    const db = requireFirestore()
    await db.collection('_meta').doc('counters').set(
      {
        [field]: FieldValue.increment(by),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
  },
}
