import { getAuth } from 'firebase-admin/auth'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { userProfilesRepo } from '@/lib/firebase/repos/users'

const USER_SESSION_COOKIE_MS = 7 * 24 * 60 * 60 * 1000
const ADMIN_SESSION_COOKIE_MS = 2 * 60 * 60 * 1000

function requireFirebaseAuth() {
  const app = getFirebaseAdminApp()
  if (!app) {
    throw new Error('Firebase is not configured')
  }
  return getAuth(app)
}

export function getSessionDurationMs(kind: 'user' | 'admin') {
  return kind === 'admin' ? ADMIN_SESSION_COOKIE_MS : USER_SESSION_COOKIE_MS
}

export async function signInWithEmailPassword(email: string, password: string) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('Missing FIREBASE_WEB_API_KEY for Firebase Auth sign-in')
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  )

  const payload = await response.json()
  if (!response.ok || !payload?.idToken) {
    const errorMessage = String(payload?.error?.message || 'INVALID_LOGIN_CREDENTIALS')
    throw new Error(errorMessage)
  }

  return {
    idToken: String(payload.idToken),
    localId: String(payload.localId || ''),
    email: String(payload.email || email),
  }
}

export async function createFirebaseSessionCookie(idToken: string, kind: 'user' | 'admin') {
  const auth = requireFirebaseAuth()
  return auth.createSessionCookie(idToken, {
    expiresIn: getSessionDurationMs(kind),
  })
}

export async function verifyFirebaseSessionCookie(sessionCookie: string, checkRevoked = true) {
  const auth = requireFirebaseAuth()
  return auth.verifySessionCookie(sessionCookie, checkRevoked)
}

export async function revokeFirebaseUserSessions(uid: string) {
  const auth = requireFirebaseAuth()
  await auth.revokeRefreshTokens(uid)
}

export async function getFirebaseUserByUid(uid: string) {
  const auth = requireFirebaseAuth()
  return auth.getUser(uid)
}

export async function ensureFirebaseCustomClaims(uid: string, claims: Record<string, unknown>) {
  const auth = requireFirebaseAuth()
  const user = await auth.getUser(uid)
  const current = user.customClaims || {}
  const merged = { ...current, ...claims }
  await auth.setCustomUserClaims(uid, merged)
}

export async function buildSessionUserFromCookie(sessionCookie: string) {
  const decoded = await verifyFirebaseSessionCookie(sessionCookie, true)
  const profile = await userProfilesRepo.findById(decoded.uid)

  return {
    id: decoded.uid,
    email: decoded.email || profile?.email || '',
    name: profile?.name ?? null,
    role: profile?.role ?? 'USER',
    isActive: profile?.isActive ?? true,
    phone: profile?.phone ?? null,
    avatar: profile?.avatar ?? null,
    lastLogin: profile?.lastLogin ?? null,
  }
}
