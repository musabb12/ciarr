import { NextRequest, NextResponse } from "next/server";
import { buildSessionUserFromCookie, revokeFirebaseUserSessions } from "@/lib/firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("user-session")?.value;
    if (token) {
      try {
        const user = await buildSessionUserFromCookie(token);
        if (user) {
          await revokeFirebaseUserSessions(user.id);
        }
      } catch {
        // ignore revoke failures and continue logout
      }
    }

    const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج" });
    response.cookies.set("user-session", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ success: true });
    response.cookies.set("user-session", "", { maxAge: 0, path: "/" });
    return response;
  }
}
