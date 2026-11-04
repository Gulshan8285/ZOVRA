import { NextResponse } from "next/server";
import { getAdminDashboardStats } from "@/lib/db";

export async function GET() {
  try {
    const stats = getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load dashboard metrics";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

