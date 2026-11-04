import { NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body?.phone;
    const code = body?.code;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Both phone number and OTP code are required." },
        { status: 400 }
      );
    }

    const result = verifyOtpCode(phone, code);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Mobile number verified successfully.",
      customer: result.customer,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OTP verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

