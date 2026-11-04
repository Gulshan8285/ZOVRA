import { NextResponse } from "next/server";
import { getAllLocations } from "@/lib/db";

export async function GET() {
  try {
    const locations = getAllLocations();
    return NextResponse.json({ success: true, locations });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load locations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

