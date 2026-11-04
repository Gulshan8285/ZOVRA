import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getAllServices, getReviews } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import HeroLocationSearch from "@/components/HeroLocationSearch";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const allServices = getAllServices();
  const popularServices = allServices.slice(0, 6);
  const reviews = getReviews({ status: "APPROVED" }).slice(0, 4);

  const faqs = [
    {
      q: "How does ZOVRA work?",
      a: "Select your desired massage therapy, customize duration and add-ons, pick an address and appointment slot (minimum 2 hours in advance), and confirm your booking. Our verified male therapist arrives at your doorstep with a portable massage table, fresh linens, and all supplies. You pay via Cash on Delivery only after the service is finished.",
    },
    {
      q: "Are massage therapists professionally trained?",
      a: "Yes, 100%. Every ZOVRA therapist has a verified government background check, formal certifications in sports or clinical bodywork, and an average of 5+ years of five-star hospitality and spa experience.",
    },
    {
      q: "Do I need to arrange anything at home?",
      a: "Virtually nothing. The therapist brings an ergonomic foldable massage table, disposable sheets, sanitized towels, organic cold-pressed oils, and soothing ambient music. All you need to provide is approximately 7ft x 4ft of floor space in a private room.",
    },
    {
      q: "Can I select my appointment time?",
      a: "Yes. You can book slots between 9:00 AM and 9:00 PM for today or upcoming days. To maintain punctuality, we enforce a strict 2-hour minimum advance booking window.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes, cancellations are 100% free up to 2 hours prior to the scheduled slot directly from your My Account dashboard. If cancelled when the therapist is already en route, a nominal travel convenience fee may apply.",
    },
    {
      q: "How do I pay?",
      a: "Initially, all bookings are powered by 100% Cash on Delivery (COD). You inspect the service quality and pay in cash or via UPI directly to the therapist once your massage is completed.",
    },
    {
      q: "How can I contact customer support?",
      a: "Our customer care team is available daily from 9:00 AM to 9:00 PM via phone (+91 98765 43210), email (care@zovra.in), or WhatsApp chat.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zovra-softBlue/25 via-white to-white pt-10 sm:pt-16 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zovra-softBlue/70 border border-zovra-deepBlue/15 text-zovra-deepBlue text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>India&apos;s Premium Men&apos;s Home Wellness</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zovra-black tracking-tight leading-[1.1]">
                  Premium Men&apos;s Massage. <br className="hidden sm:inline" />
                  <span className="text-zovra-deepBlue">Delivered to Your Door.</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Experience professional massage and wellness services in the comfort of your home.
                  Choose your preferred treatment and book your appointment in minutes.
                </p>
              </div>

              {/* Location Checker Bar */}
              <div className="max-w-md mx-auto lg:mx-0">
                <HeroLocationSearch />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zovra-black text-white text-sm font-semibold hover:bg-black/85 transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Explore Massage Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-gray-300 text-zovra-black text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  How It Works
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue" />
                  <span>Certified Male Therapists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue" />
                  <span>Portable Spa Bed Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-zovra-deepBlue" />
                  <span>100% Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-4/5 rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85"
                  alt="ZOVRA Premium Men's Massage Therapy at Home"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Rating Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 text-zovra-black flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>4.92 / 5.0 Rating</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Based on 1,400+ verified home sessions</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold text-xs">
                    5★
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <TrustSection />

      {/* POPULAR MEN'S MASSAGE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
              Signature Therapies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zovra-black tracking-tight">
              Popular Men&apos;s Massage Services
            </h2>
            <p className="text-sm text-gray-500">
              Scientifically engineered treatments tailored for male muscle density, postural fatigue, and deep athletic recovery.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zovra-black hover:text-zovra-deepBlue transition-colors group self-start md:self-end pb-1 border-b border-black hover:border-zovra-deepBlue"
          >
            <span>View All 10 Services</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* VERIFIED CUSTOMER REVIEWS */}
      <section className="bg-zovra-lightGrey/50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
                Real Customer Feedback
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zovra-black tracking-tight">
                Verified Customer Reviews
              </h2>
              <p className="text-sm text-gray-500">
                Only clients with genuine, completed home bookings are eligible to review our services.
              </p>
            </div>

            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zovra-black hover:text-zovra-deepBlue transition-colors group self-start md:self-end pb-1 border-b border-black"
            >
              <span>See All Reviews</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-card transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {rev.verifiedBooking && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Booking
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed italic line-clamp-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1">
                  <div className="text-xs font-bold text-zovra-black">{rev.customerName}</div>
                  <div className="text-[11px] text-zovra-deepBlue font-medium truncate">
                    {rev.serviceName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Answers & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zovra-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500">
            Everything you need to know about preparing for your home wellness session.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-gray-200 bg-white p-5 open:bg-zovra-lightGrey/40 transition-colors"
            >
              <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-zovra-black cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-zovra-deepBlue shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-4 pl-7 pt-2 border-t border-gray-100">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl bg-zovra-black text-white p-10 sm:p-16 overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-zovra-softBlue">
              Ready for Deep Rejuvenation?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Your Comfort. Your Home. Your Time.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Book a verified male therapist today. Seamless 2-minute booking, transparent pricing,
              and 100% Cash on Delivery payment after your session.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zovra-black text-sm font-bold hover:bg-gray-100 transition-transform active:scale-95 shadow-lg"
              >
                Book Your Massage
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors border border-white/15"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
