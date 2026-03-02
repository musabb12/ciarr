import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

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
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({
    data: { userId, token, expiresAt },
  });
  return { token, expiresAt };
}

export async function validateUserSession(token: string): Promise<{
  valid: boolean;
  user?: { id: string; email: string; name: string | null; role: UserRole };
  error?: string;
}> {
  try {
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      if (session) await db.session.delete({ where: { id: session.id } });
      return { valid: false, error: "انتهت صلاحية الجلسة" };
    }
    if (!session.user.isActive) {
      return { valid: false, error: "الحساب غير مفعّل" };
    }
    return {
      valid: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    };
  } catch (e) {
    console.error("validateUserSession:", e);
    return { valid: false, error: "فشل التحقق من الجلسة" };
  }
}

export async function deleteUserSession(token: string): Promise<void> {
  await db.session.deleteMany({ where: { token } });
}

export { SESSION_DURATION_MS };
