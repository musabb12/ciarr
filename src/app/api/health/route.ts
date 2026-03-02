import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.user.count();
    return NextResponse.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("Health check DB error:", err);
    return NextResponse.json(
      { ok: false, db: "error", error: String((err as Error)?.message) },
      { status: 500 }
    );
  }
}