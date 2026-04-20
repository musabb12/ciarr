import { NextRequest, NextResponse } from "next/server";
import { buildSessionUserFromCookie } from "@/lib/firebase/auth";
import { userProfilesRepo } from "@/lib/firebase/repos";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const result = await buildSessionUserFromCookie(token);
    if (!result || !result.isActive) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const user = await userProfilesRepo.findById(result.id);
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { name, phone } = body;

    const user = await userProfilesRepo.update(result.id, {
      ...(typeof name === "string" && { name: name.trim() || null }),
      ...(typeof phone === "string" && { phone: phone.trim() || null }),
    });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الملف الشخصي" }, { status: 500 });
  }
}
