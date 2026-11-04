import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Please provide a date in YYYY-MM-DD format." },
        { status: 400 }
      );
    }

    const slots = getAvailableSlots(date);
    return NextResponse.json({
      success: true,
      date,
      serverTime: new Date().toISOString(),
      minLeadTimeHours: 2,
      slots,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch slots";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

