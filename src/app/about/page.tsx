import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Sparkles, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About ZOVRA | Premium Men's Home Wellness & Massage",
  description:
    "Discover ZOVRA's mission to redefine men's wellness at home with verified male therapists, ergonomic spa equipment, and dignified hospitality.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Our Purpose & Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-zovra-black tracking-tight">
            Crafting India&apos;s Finest Men&apos;s Home Wellness Experience
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Relax. Recharge. Rejuvenate. We believe men deserve five-star therapeutic bodywork without the commute, awkwardness, or questionable quality of generic spas.
          </p>
        </div>

        {/* Feature Visual with Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
              alt="ZOVRA Home Spa Setup"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <h2 className="text-2xl font-black text-zovra-black">
              Born from a Real Need for Trust & Excellence
            </h2>
            <p>
              Modern urban men work 60+ hour weeks behind screens, push their physical limits in gyms, and endure long commutes. Yet when seeking muscular recovery, the options were either overpriced luxury hotels requiring long travel or dubious local massage parlours lacking transparency and hygiene.
            </p>
            <p>
              ZOVRA was built to change that forever. We created an uncompromising standard: verified male massage therapists equipped with heavy-duty portable massage beds, single-use sterilized sheets, and cold-pressed botanical oils, brought straight to your home.
            </p>
            <p>
              With our transparent Cash on Delivery model, you pay only after your treatment is delivered to your complete satisfaction.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8 pt-8 border-t border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zovra-black">
              The Four Cornerstones of ZOVRA
            </h2>
            <p className="text-xs text-gray-500">Every single appointment is governed by these non-negotiable rules.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zovra-black">Rigorous Therapist Vetting</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Only male therapists with certified diplomas in sports massage or Swedish bodywork and an average of 5+ years of five-star hospitality experience are onboarded. Full police background verification is mandatory.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zovra-black">Hospital-Grade Sanitization</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Cleanliness is paramount. Therapists use fresh single-use disposable bed covers, sanitized face cradle protectors, sealed cotton towels, and hygienic disposables that leave zero mess in your home.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zovra-black">Strict Ethical Boundaries</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                ZOVRA is an authentic therapeutic wellness and athletic recovery service. We observe strict professional draping and ethical conduct protocols. All services are strictly non-sexual.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zovra-black">Cash on Delivery Transparency</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                No forced online prepayment or hidden fees. We trust our quality, and you pay only after your massage session is completed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85 transition-colors shadow-lg"
          >
            <span>Explore All Men&apos;s Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
