import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateUserSession } from "@/lib/user-auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (!token) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const result = await validateUserSession(token);
    if (!result.valid || !result.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: result.user.id },
      select: { id: true, email: true, name: true, phone: true, avatar: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ user });
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

    const result = await validateUserSession(token);
    if (!result.valid || !result.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const updateData: { name?: string; phone?: string } = {};
    if (typeof name === "string") updateData.name = name.trim() || null;
    if (typeof phone === "string") updateData.phone = phone.trim() || null;

    const user = await db.user.update({
      where: { id: result.user.id },
      data: updateData,
      select: { id: true, email: true, name: true, phone: true, avatar: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث الملف الشخصي" }, { status: 500 });
  }
}
