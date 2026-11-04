import { NextResponse } from "next/server";
import { getReviews, createReview, updateReviewStatus } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId") || undefined;
    const status = searchParams.get("status") || undefined;

    const reviews = getReviews({ serviceId, status });
    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, rating, serviceQualityRating, therapistRating, experienceRating, comment } = body;

    if (!bookingId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Booking ID, rating, and written review are required." },
        { status: 400 }
      );
    }

    const result = createReview({
      bookingId,
      rating: Number(rating),
      serviceQualityRating: Number(serviceQualityRating || rating),
      therapistRating: Number(therapistRating || rating),
      experienceRating: Number(experienceRating || rating),
      comment,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: result.review }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit review";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, therapistReply } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Review ID and status required" }, { status: 400 });
    }

    updateReviewStatus(id, status, therapistReply);
    return NextResponse.json({ success: true, message: "Review updated successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update review";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

