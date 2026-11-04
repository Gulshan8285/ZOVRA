import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Cancellation and Refund Policy | ZOVRA Men's Home Wellness",
  description: "Clear and fair cancellation and rescheduling guidelines for ZOVRA home massage appointments.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Transparent Policies
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-gray-400">Last updated: November 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">1. Free Cancellation Window</h2>
            <p>
              We understand plans can change unexpectedly. You can cancel or reschedule your home massage appointment completely free of charge up to <strong>2 hours prior</strong> to your scheduled slot time directly from your My Account dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">2. Late Cancellations & Therapist En Route</h2>
            <p>
              If an appointment is cancelled less than 2 hours before the scheduled time or after the therapist has already departed with the massage equipment, a nominal transit convenience fee of <strong>₹150</strong> may be added to your next booking to compensate the therapist for fuel and time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">3. Rescheduling an Appointment</h2>
            <p>
              You can reschedule your slot at any time up to 2 hours in advance without any fee. Available slots for today and future days can be chosen subject to dynamic therapist availability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">4. Refunds on Cash on Delivery</h2>
            <p>
              Because all initial transactions are powered by Cash on Delivery (COD), payment is only collected after the service has been successfully completed. Hence, cancellations require no credit card refund turnaround.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">5. Service Dissatisfaction Guarantee</h2>
            <p>
              If your therapist arrives more than 30 minutes late without prior notice, or fails to meet our hygiene and equipment standards, you may decline the session with zero penalty. Our concierge will gladly re-assign a master therapist at a courtesy discount.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link href="/faq" className="text-xs font-semibold text-zovra-deepBlue hover:underline">
            ← Frequently Asked Questions
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85"
          >
            <span>Book Your Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
