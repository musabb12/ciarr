import { NextRequest, NextResponse } from "next/server";
import { validateUserSession } from "@/lib/user-auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const result = await validateUserSession(token);
    if (!result.valid) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
