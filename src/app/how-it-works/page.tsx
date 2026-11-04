import React from "react";
import Link from "next/link";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";

export const metadata = {
  title: "How ZOVRA Works | Effortless Men's Home Wellness Booking",
  description: "Learn how ZOVRA delivers premium massage therapies to your home with verified male masseurs, portable spa tables, and Cash on Delivery.",
};

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Transparent Home Wellness
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-zovra-black tracking-tight">
            How ZOVRA Delivers 5-Star Home Massage
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            From easy 2-minute mobile booking to therapist arrival with clean linens and a portable spa bed.
          </p>
        </div>

        {/* 4 Step Visual */}
        <HowItWorks />

        {/* Detailed Breakdown */}
        <div className="space-y-10 pt-10 border-t border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zovra-black">
              What to Expect on Your Appointment Day
            </h2>
            <p className="text-xs text-gray-500">
              Zero clutter, zero preparation hassle, and hospital-grade sanitisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zovra-black text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-zovra-black">
                What Our Therapist Brings With Him
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Professional, foldable, high-density foam massage bed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Fresh disposable sheets, headrest covers & sterilized cotton towels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Cold-pressed organic carrier oils & natural therapeutic essential extracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Gentle ambient relaxation sound device</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Post-session warm wipe-down supplies and disposal bags</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zovra-black text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-zovra-black">
                What You Need to Arrange at Home
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Approximately 7ft x 4ft of clear floor space in any private room</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Comfortable room temperature (air conditioner or heater if needed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>A quiet, disturbance-free atmosphere to maximize deep rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                  <span>Warm shower prior to session recommended for optimal muscle release</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2-Hour Advance Rule Callout */}
        <div className="p-8 rounded-3xl bg-zovra-softBlue/30 border border-zovra-softBlue space-y-3">
          <div className="flex items-center gap-2 text-zovra-deepBlue font-black text-sm">
            <Clock className="w-5 h-5" />
            <span>Why Do We Enforce a Strict 2-Hour Advance Booking Lead Time?</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Unlike taxi apps or food delivery, professional wellness requires thorough preparation. Our therapists carry heavy specialized massage beds, fresh sanitized linens, and specialized oils. Enforcing a strict 2-hour minimum lead time ensures our certified therapists arrive on-time without rushing, and undergo hygiene preparation before stepping into your home.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85 transition-colors shadow-lg"
          >
            <span>Explore Men&apos;s Massage Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
