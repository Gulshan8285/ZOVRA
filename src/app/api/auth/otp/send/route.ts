import { NextResponse } from "next/server";
import { requestOtp } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body?.phone;

    if (!phone || typeof phone !== "string" || phone.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const result = requestOtp(phone);
    return NextResponse.json({
      success: true,
      message: result.message,
      code: result.code, // Returned for dev testing convenience
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

