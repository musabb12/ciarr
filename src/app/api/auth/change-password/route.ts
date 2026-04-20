import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/user-auth";
import { buildSessionUserFromCookie, signInWithEmailPassword } from "@/lib/firebase/auth";
import { userProfilesRepo } from "@/lib/firebase/repos";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const result = await buildSessionUserFromCookie(token);
    if (!result || !result.isActive) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية وكلمة المرور الجديدة مطلوبتان" },
        { status: 400 }
      );
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `كلمة المرور الجديدة يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل` },
        { status: 400 }
      );
    }

    try {
      await signInWithEmailPassword(result.email, currentPassword);
    } catch {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });
    }

    const hashedPassword = hashPassword(newPassword);
    await userProfilesRepo.update(result.id, {
      password: newPassword,
      passwordHash: hashedPassword,
    });

    return NextResponse.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تغيير كلمة المرور" }, { status: 500 });
  }
}
