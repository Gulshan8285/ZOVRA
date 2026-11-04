import { NextResponse } from "next/server";
import { getAllServices, saveService } from "@/lib/db";
import { Service } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const all = searchParams.get("all") === "true"; // includes inactive if admin

    let services = getAllServices(!all);
    if (category && category !== "All") {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({ success: true, services });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch services";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Service;
    if (!body.name || !body.slug || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, slug, basePrice" },
        { status: 400 }
      );
    }

    const saved = saveService(body);
    return NextResponse.json({ success: true, service: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save service";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

