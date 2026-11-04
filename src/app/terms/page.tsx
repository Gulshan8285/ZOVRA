import React from "react";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | ZOVRA Men's Home Wellness",
  description: "Terms of service, professional conduct guidelines, non-sexual wellness pledge, and customer policies.",
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Customer Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-400">Last updated: November 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Strict Non-Sexual Wellness Policy */}
          <div className="p-6 rounded-3xl bg-zovra-softBlue/30 border border-zovra-softBlue space-y-3 text-zovra-deepBlue">
            <h2 className="text-base font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Strict Non-Sexual Professional Wellness Policy</span>
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              ZOVRA is an exclusive, non-sexual therapeutic home bodywork and athletic recovery service. All sessions are conducted with standard sanitary professional draping. Any solicitation, sexual request, or inappropriate behavior towards our therapists is strictly prohibited, results in immediate service termination without refund, and will be reported to law enforcement.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">1. Appointment Booking & Advance Lead Time</h2>
            <p>
              To ensure on-time transit and equipment setup, all appointments require a minimum 2-hour advance booking lead time from the current server time. Bookings are confirmed upon generation of a valid booking ID (`ZOV-2026-XXXXXX`).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">2. Payment & Cash on Delivery (COD)</h2>
            <p>
              ZOVRA operates on a Cash on Delivery model. The client agrees to settle the full displayed invoice total directly with the therapist upon conclusion of the massage session via cash or UPI. There are no compulsory gratuities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">3. Health & Medical Disclosures</h2>
            <p>
              Clients are responsible for informing the therapist before the session begins of any acute injuries, spinal disc herniations, cardiovascular conditions, skin infections, or recent surgeries. Our massages are intended for relaxation and muscular relief, and do not substitute medical care.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-zovra-black">4. Safety & Safe Work Environment</h2>
            <p>
              Clients agree to provide a safe, respectful, and private environment (approx. 7ft x 4ft clear floor space) for the therapist and equipment setup.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
