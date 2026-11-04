import { NextResponse } from "next/server";
import { getBookingById, updateBookingStatus } from "@/lib/db";
import { BookingStatus, PaymentStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = getBookingById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch booking";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      status?: BookingStatus;
      assignedTherapistId?: string;
      cancellationReason?: string;
      internalNotes?: string;
      paymentStatus?: PaymentStatus;
    };

    if (!body.status && !body.paymentStatus && !body.assignedTherapistId && body.internalNotes === undefined) {
      return NextResponse.json(
        { success: false, error: "No update parameters provided." },
        { status: 400 }
      );
    }

    const currentBooking = getBookingById(id);
    if (!currentBooking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const updated = updateBookingStatus(id, body.status || currentBooking.status, {
      assignedTherapistId: body.assignedTherapistId,
      cancellationReason: body.cancellationReason,
      internalNotes: body.internalNotes,
      paymentStatus: body.paymentStatus,
    });

    if (!updated.success) {
      return NextResponse.json({ success: false, error: updated.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, booking: updated.booking });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update booking";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

