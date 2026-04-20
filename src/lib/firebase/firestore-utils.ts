import { Timestamp } from 'firebase-admin/firestore'
import { getFirebaseAdminServices } from '@/lib/firebase-admin'

export function requireFirestore() {
  const services = getFirebaseAdminServices()
  if (!services) {
    throw new Error('Firebase is not configured')
  }
  return services.db
}

export function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in (value as Record<string, unknown>) &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    try {
      return (value as { toDate: () => Date }).toDate()
    } catch {
      return null
    }
  }
  return null
}

export function toIsoString(value: unknown): string | null {
  const date = toDate(value)
  return date ? date.toISOString() : null
}
