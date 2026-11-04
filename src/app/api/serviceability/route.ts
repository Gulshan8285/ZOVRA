import { NextResponse } from "next/server";
import { checkPinServiceability } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Please provide a PIN code." },
        { status: 400 }
      );
    }

    const result = checkPinServiceability(pin);
    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify PIN";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

