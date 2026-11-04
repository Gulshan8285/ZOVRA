import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { getBookingById } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmedPage({ params }: Props) {
  const { id } = await params;
  const booking = getBookingById(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-20 bg-zovra-lightGrey/40 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-elevated p-8 sm:p-12 space-y-8 animate-fadeIn text-center sm:text-left">
          {/* Header checkmark */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                Booking Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zovra-black mt-1">
                Your Appointment is Scheduled!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                A verified ZOVRA therapist will arrive with a portable massage bed and organic oils.
              </p>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-zovra-lightGrey/60 rounded-2xl p-6 border border-gray-200/80 space-y-5 text-xs text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Booking ID</span>
              <span className="font-mono font-black text-sm text-zovra-black tracking-wider">
                {booking.id}
              </span>
            </div>

            <div className="flex items-start gap-4 pb-3 border-b border-gray-200">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={booking.serviceImage}
                  alt={booking.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-zovra-black">
                  {booking.serviceName}
                </h3>
                <div className="text-gray-500 mt-1 flex items-center gap-2">
                  <span>Duration: {booking.durationMinutes} mins</span>
                  {booking.selectedAddOns.length > 0 && (
                    <span>• {booking.selectedAddOns.length} Add-on(s)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-200">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Appointment Date & Time</span>
                <div className="font-bold text-zovra-black flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-zovra-deepBlue" />
                  <span>{booking.appointmentDate}</span>
                  <span>at</span>
                  <span>{booking.timeSlot}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Payment Method</span>
                <div className="font-bold text-zovra-black flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-zovra-deepBlue" />
                  <span>Cash on Delivery (Pay ₹{booking.totalAmount.toLocaleString()})</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-medium block">Service Address</span>
              <p className="font-bold text-zovra-black">{booking.customerName} ({booking.customerPhone})</p>
              <p className="text-gray-600">
                {booking.address.houseNumber}, {booking.address.building}, {booking.address.street},{" "}
                {booking.address.city} - {booking.address.pinCode}
              </p>
              {booking.address.landmark && (
                <p className="text-gray-500">Landmark: {booking.address.landmark}</p>
              )}
            </div>
          </div>

          {/* What to expect next */}
          <div className="p-4 rounded-xl bg-zovra-softBlue/30 border border-zovra-softBlue text-xs text-zovra-deepBlue space-y-2 text-left">
            <span className="font-bold block">What Happens Next:</span>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Our dispatch desk assigns a certified male therapist to your appointment.</li>
              <li>You can view status updates (Therapist Assigned, On The Way) in your dashboard.</li>
              <li>Therapist brings clean linens, massage bed & supplies. Pay via Cash/UPI on completion.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/account"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-zovra-black text-white text-xs font-bold hover:bg-black/85 text-center transition-colors shadow-md"
            >
              View My Bookings & Account
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-gray-300 text-zovra-black text-xs font-semibold hover:bg-gray-50 text-center transition-colors"
            >
              Continue Exploring ZOVRA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
