export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  sessions: 'sessions',
  settings: 'settings',
  websites: 'websites',
  news: 'news',
  services: 'services',
  contacts: 'contacts',
  backgrounds: 'backgrounds',
  logs: 'logs',
} as const

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS]

export type FirestoreUserRole = 'ADMIN' | 'USER'
export type FirestoreContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'
