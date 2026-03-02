// Admin credentials - في التطبيق الحقيقي يجب تخزينها في متغيرات البيئة
const ADMIN_CREDENTIALS = {
  username: 'ciar',
  password: 'Mosabb1313'
};

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // ساعتان
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? 'ciar-admin-demo-secret';

interface SessionPayload {
  username: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export async function createAdminSession(username: string, password: string): Promise<{ success: boolean; sessionId?: string; expiresAt?: number; error?: string }> {
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return { success: false, error: 'Invalid username or password' };
  }

  const now = Date.now();
  const payload: SessionPayload = {
    username,
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    nonce: await generateRandomHex()
  };

  const sessionId = await signSessionPayload(payload);

  return { success: true, sessionId, expiresAt: payload.expiresAt };
}

export async function validateAdminSession(sessionId: string): Promise<{ valid: boolean; username?: string; error?: string }> {
  const verification = await verifySessionToken(sessionId);

  if (!verification.valid) {
    return { valid: false, error: verification.error };
  }

  return { valid: true, username: verification.payload?.username };
}

export async function extendSession(sessionId: string): Promise<{ success: boolean; sessionId?: string; expiresAt?: number; error?: string }> {
  const verification = await verifySessionToken(sessionId);

  if (!verification.valid || !verification.payload) {
    return { success: false, error: verification.error ?? 'Invalid session' };
  }

  const now = Date.now();
  const payload: SessionPayload = {
    ...verification.payload,
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    nonce: await generateRandomHex()
  };

  const refreshedSessionId = await signSessionPayload(payload);

  return { success: true, sessionId: refreshedSessionId, expiresAt: payload.expiresAt };
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  // مع نموذج الجلسة عديم الحالة يكفي إعلام الواجهة الأمامية لحذف الكوكيز
  return { success: true };
}

async function verifySessionToken(sessionId: string): Promise<{ valid: boolean; payload?: SessionPayload; error?: string }> {
  try {
    const [encodedPayload, signature] = sessionId.split('.');

    if (!encodedPayload || !signature) {
      return { valid: false, error: 'Malformed session token' };
    }

    const payloadString = decodeURIComponent(encodedPayload);
    const expectedSignature = await signMessage(payloadString);

    if (!timingSafeEqual(signature, expectedSignature)) {
      return { valid: false, error: 'Invalid session signature' };
    }

    const payload = JSON.parse(payloadString) as SessionPayload;

    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error('Session verification failed:', error);
    return { valid: false, error: 'Failed to verify session' };
  }
}

async function signSessionPayload(payload: SessionPayload): Promise<string> {
  const payloadString = JSON.stringify(payload);
  const signature = await signMessage(payloadString);
  return `${encodeURIComponent(payloadString)}.${signature}`;
}

async function signMessage(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const secretData = encoder.encode(SESSION_SECRET);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const key = await crypto.subtle.importKey('raw', secretData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, data);
    return bufferToHex(new Uint8Array(signature));
  }

  const { createHmac } = await import('crypto');
  return createHmac('sha256', SESSION_SECRET).update(message).digest('hex');
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function generateRandomHex(): Promise<string> {
  const webCrypto = (globalThis as any).crypto;

  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    const arr = new Uint8Array(16);
    webCrypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const { randomBytes } = await import('crypto');
  return randomBytes(16).toString('hex');
}