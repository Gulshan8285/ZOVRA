import { NextResponse } from "next/server";
import { saveCustomerAddress, deleteCustomerAddress } from "@/lib/db";
import { Address } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, address } = body as { phone: string; address: Address };

    if (!phone || !address || !address.houseNumber || !address.pinCode) {
      return NextResponse.json(
        { success: false, error: "Phone and address details are required." },
        { status: 400 }
      );
    }

    const updatedCustomer = saveCustomerAddress(phone, address);
    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save address";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const addressId = searchParams.get("addressId");

    if (!phone || !addressId) {
      return NextResponse.json(
        { success: false, error: "Phone and address ID required" },
        { status: 400 }
      );
    }

    const updatedCustomer = deleteCustomerAddress(phone, addressId);
    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete address";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

