import { NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/db";
import { Address } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone") || undefined;
    const status = searchParams.get("status") || undefined;
    const date = searchParams.get("date") || undefined;
    const search = searchParams.get("search") || undefined;

    const bookings = getBookings({ phone, status, date, search });
    return NextResponse.json({ success: true, bookings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch bookings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      serviceId: string;
      durationMinutes: number;
      selectedAddOns?: { id: string; name: string; price: number; durationAddMinutes: number }[];
      appointmentDate: string;
      timeSlot: string;
      address: Address;
      couponCode?: string;
    };

    if (
      !body.customerName ||
      !body.customerPhone ||
      !body.serviceId ||
      !body.appointmentDate ||
      !body.timeSlot ||
      !body.address ||
      !body.address.pinCode
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required booking fields." },
        { status: 400 }
      );
    }

    const result = createBooking({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      serviceId: body.serviceId,
      durationMinutes: body.durationMinutes || 60,
      selectedAddOns: body.selectedAddOns || [],
      appointmentDate: body.appointmentDate,
      timeSlot: body.timeSlot,
      address: body.address,
      couponCode: body.couponCode,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, booking: result.booking }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking creation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

