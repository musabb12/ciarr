import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections'
import { requireFirestore } from '@/lib/firebase/firestore-utils'

export const settingsRepo = {
  async getRaw(key: string) {
    const db = requireFirestore()
    const doc = await db.collection(FIRESTORE_COLLECTIONS.settings).doc(key).get()
    if (!doc.exists) return null
    return doc.data() || null
  },

  async getValue(key: string) {
    const data = await this.getRaw(key)
    if (!data) return null
    return typeof data.value === 'string' ? data.value : null
  },

  async setValue(key: string, value: string, group = 'general', type = 'json') {
    const db = requireFirestore()
    const now = new Date().toISOString()
    await db.collection(FIRESTORE_COLLECTIONS.settings).doc(key).set(
      {
        key,
        value,
        group,
        type,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    )
  },
}
