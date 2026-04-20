import {
  getSessionDurationMs,
  signInWithEmailPassword,
} from '@/lib/firebase/auth'
import { userProfilesRepo } from '@/lib/firebase/repos'

const SESSION_DURATION_MS = getSessionDurationMs('admin')
const DEFAULT_ADMIN_EMAIL = process.env.FIREBASE_ADMIN_EMAIL || 'admin@ciar.local'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'ciar-admin-demo-secret'

interface AdminSessionPayload {
  uid: string
  email: string
  issuedAt: number
  expiresAt: number
  nonce: string
}

function resolveAdminEmail(username: string) {
  const value = String(username || '').trim()
  if (value.includes('@')) return value
  if (value.toLowerCase() === 'ciar') return DEFAULT_ADMIN_EMAIL
  return DEFAULT_ADMIN_EMAIL
}

export async function createAdminSession(
  username: string,
  password: string
): Promise<{ success: boolean; sessionId?: string; expiresAt?: number; error?: string }> {
  try {
    const email = resolveAdminEmail(username)
    const login = await signInWithEmailPassword(email, password)
    const sessionUser = await userProfilesRepo.findById(login.localId)

    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return { success: false, error: 'هذا الحساب لا يملك صلاحية الأدمن' }
    }

    const now = Date.now()
    const sessionId = await signSessionPayload({
      uid: sessionUser.id,
      email: sessionUser.email,
      issuedAt: now,
      expiresAt: now + SESSION_DURATION_MS,
      nonce: await generateRandomHex(),
    })

    return {
      success: true,
      sessionId,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    }
  } catch (error) {
    const message = (error as Error)?.message || 'فشل تسجيل دخول الأدمن'
    const isCredentialIssue = /INVALID_LOGIN_CREDENTIALS|EMAIL_NOT_FOUND|INVALID_PASSWORD/i.test(message)
    return {
      success: false,
      error: isCredentialIssue ? 'بيانات الدخول غير صحيحة' : message,
    }
  }
}

export async function validateAdminSession(
  sessionId: string
): Promise<{ valid: boolean; username?: string; error?: string }> {
  try {
    const verification = await verifySessionToken(sessionId)
    if (!verification.valid || !verification.payload) {
      return { valid: false, error: verification.error || 'Invalid session' }
    }
    const profile = await userProfilesRepo.findById(verification.payload.uid)
    if (!profile || profile.role !== 'ADMIN' || !profile.isActive) {
      return { valid: false, error: 'الصلاحيات غير كافية' }
    }
    return { valid: true, username: verification.payload.email || profile.email || undefined }
  } catch (error) {
    return { valid: false, error: (error as Error)?.message || 'Invalid session' }
  }
}

export async function extendSession(
  sessionId: string
): Promise<{ success: boolean; sessionId?: string; expiresAt?: number; error?: string }> {
  const verification = await verifySessionToken(sessionId)
  if (!verification.valid || !verification.payload) {
    return { success: false, error: verification.error ?? 'Invalid session' }
  }
  const profile = await userProfilesRepo.findById(verification.payload.uid)
  if (!profile || profile.role !== 'ADMIN' || !profile.isActive) {
    return { success: false, error: 'الصلاحيات غير كافية' }
  }

  const now = Date.now()
  const refreshedSessionId = await signSessionPayload({
    ...verification.payload,
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    nonce: await generateRandomHex(),
  })

  return {
    success: true,
    sessionId: refreshedSessionId,
    expiresAt: now + SESSION_DURATION_MS,
  }
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  return { success: true }
}

async function verifySessionToken(
  sessionId: string
): Promise<{ valid: boolean; payload?: AdminSessionPayload; error?: string }> {
  try {
    const [encodedPayload, signature] = sessionId.split('.')
    if (!encodedPayload || !signature) {
      return { valid: false, error: 'Malformed session token' }
    }

    const payloadString = decodeURIComponent(encodedPayload)
    const expectedSignature = await signMessage(payloadString)

    if (!timingSafeEqual(signature, expectedSignature)) {
      return { valid: false, error: 'Invalid session signature' }
    }

    const payload = JSON.parse(payloadString) as AdminSessionPayload
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session expired' }
    }

    return { valid: true, payload }
  } catch {
    return { valid: false, error: 'Failed to verify session' }
  }
}

async function signSessionPayload(payload: AdminSessionPayload): Promise<string> {
  const payloadString = JSON.stringify(payload)
  const signature = await signMessage(payloadString)
  return `${encodeURIComponent(payloadString)}.${signature}`
}

async function signMessage(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const secretData = encoder.encode(SESSION_SECRET)

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const key = await crypto.subtle.importKey('raw', secretData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const signature = await crypto.subtle.sign('HMAC', key, data)
    return bufferToHex(new Uint8Array(signature))
  }

  const { createHmac } = await import('crypto')
  return createHmac('sha256', SESSION_SECRET).update(message).digest('hex')
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

async function generateRandomHex(): Promise<string> {
  const webCrypto = (globalThis as { crypto?: Crypto }).crypto
  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    const arr = new Uint8Array(16)
    webCrypto.getRandomValues(arr)
    return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const { randomBytes } = await import('crypto')
  return randomBytes(16).toString('hex')
}