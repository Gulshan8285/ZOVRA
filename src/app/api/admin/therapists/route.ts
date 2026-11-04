import { NextResponse } from "next/server";
import { getAllTherapists, saveTherapist } from "@/lib/db";
import { Therapist } from "@/lib/types";

export async function GET() {
  try {
    const therapists = getAllTherapists();
    return NextResponse.json({ success: true, therapists });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load therapists";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Therapist;
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: "Name and phone are required." }, { status: 400 });
    }

    if (!body.id) {
      body.id = `th-${Date.now()}`;
    }

    const saved = saveTherapist(body);
    return NextResponse.json({ success: true, therapist: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save therapist";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

