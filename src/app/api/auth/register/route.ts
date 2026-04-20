import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/user-auth";
import { userProfilesRepo } from "@/lib/firebase/repos";

// فرض تشغيل Node.js (لـ crypto)
export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "صيغة البريد الإلكتروني غير صحيحة" },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `كلمة المرور يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل` },
        { status: 400 }
      );
    }

    const existing = await userProfilesRepo.findByEmail(trimmedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مسجّل مسبقاً" },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const user = await userProfilesRepo.create({
      email: trimmedEmail,
      password,
      passwordHash: hashedPassword,
      name: name ? String(name).trim() || null : null,
      role: "USER",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: unknown) {
    console.error("Register error:", error);

    // رسالة أوضح لأخطاء قاعدة البيانات
    const err = error as { code?: string; message?: string };
    return NextResponse.json(
      { error: err?.message || "حدث خطأ أثناء التسجيل. تحقق من الطرفية." },
      { status: 500 }
    );
  }
}
