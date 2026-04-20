import { NextRequest, NextResponse } from "next/server";
import { buildSessionUserFromCookie } from "@/lib/firebase/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await buildSessionUserFromCookie(token);
    if (!user || !user.isActive) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
