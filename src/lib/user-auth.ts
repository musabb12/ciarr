import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { sessionsRepo, userProfilesRepo } from "@/lib/firebase/repos";
import type { FirestoreUserRole } from "@/lib/firebase/collections";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 أيام
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const verifyHash = scryptSync(password, salt, KEY_LENGTH);
    return timingSafeEqual(Buffer.from(hash, "hex"), verifyHash);
  } catch {
    return false;
  }
}

export async function createUserSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const { token, expiresAt } = await sessionsRepo.create(userId, SESSION_DURATION_MS);
  return { token, expiresAt };
}

export async function validateUserSession(token: string): Promise<{
  valid: boolean;
  user?: { id: string; email: string; name: string | null; role: FirestoreUserRole };
  error?: string;
}> {
  try {
    const session = await sessionsRepo.findByToken(token);
    if (!session) {
      return { valid: false, error: "انتهت صلاحية الجلسة" };
    }
    if (new Date(session.expiresAt) < new Date()) {
      await sessionsRepo.deleteByToken(token);
      return { valid: false, error: "انتهت صلاحية الجلسة" };
    }
    const user = await userProfilesRepo.findById(session.userId);
    if (!user) {
      await sessionsRepo.deleteByToken(token);
      return { valid: false, error: "المستخدم غير موجود" };
    }
    if (!user.isActive) {
      return { valid: false, error: "الحساب غير مفعّل" };
    }
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (e) {
    console.error("validateUserSession:", e);
    return { valid: false, error: "فشل التحقق من الجلسة" };
  }
}

export async function deleteUserSession(token: string): Promise<void> {
  await sessionsRepo.deleteByToken(token);
}

export { SESSION_DURATION_MS };
