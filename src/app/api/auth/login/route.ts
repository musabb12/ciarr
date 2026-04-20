import { NextRequest, NextResponse } from "next/server";
import { createFirebaseSessionCookie, signInWithEmailPassword } from "@/lib/firebase/auth";
import { userProfilesRepo } from "@/lib/firebase/repos";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const profile = await userProfilesRepo.findByEmail(normalizedEmail);
    if (!profile) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    if (!profile.isActive) {
      return NextResponse.json(
        { error: "الحساب غير مفعّل. تواصل مع الإدارة." },
        { status: 403 }
      );
    }

    let idToken = "";
    try {
      const signIn = await signInWithEmailPassword(normalizedEmail, String(password));
      idToken = signIn.idToken;
    } catch {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const sessionCookie = await createFirebaseSessionCookie(idToken, "user");
    await userProfilesRepo.touchLastLogin(profile.id);

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    });

    response.cookies.set("user-session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 أيام
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
