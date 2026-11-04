import { NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch service";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

