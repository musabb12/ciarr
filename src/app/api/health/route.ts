import { NextResponse } from "next/server";
import { userProfilesRepo } from "@/lib/firebase/repos";

export async function GET() {
  try {
    await userProfilesRepo.count();
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("Health check DB error:", err);
    return NextResponse.json(
      { ok: false, db: "error", error: String((err as Error)?.message) },
      { status: 500 }
    );
  }
}