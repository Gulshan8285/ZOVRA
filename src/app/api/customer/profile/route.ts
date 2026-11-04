import { NextResponse } from "next/server";
import { getCustomerByPhone, updateCustomerProfile } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });
    }

    const customer = getCustomerByPhone(phone);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch customer";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, email } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });
    }

    const updated = updateCustomerProfile(phone, { name, email });
    return NextResponse.json({ success: true, customer: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

