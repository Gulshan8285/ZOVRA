import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | ZOVRA Men's Home Wellness",
  description: "Find clear answers on how to book, home massage equipment, certified male masseurs, cash on delivery, and our 2-hour advance booking rule.",
};

export default function FAQPage() {
  const sections = [
    {
      category: "Booking & Availability",
      items: [
        {
          q: "How do I book a massage session with ZOVRA?",
          a: "Browse our 10 men's therapies, select your preferred treatment duration and optional add-ons, enter your delivery address, choose an available date and time slot (minimum 2 hours in advance), verify your mobile number with a quick OTP, and confirm with Cash on Delivery.",
        },
        {
          q: "Why is there a minimum 2-hour advance booking requirement?",
          a: "Unlike delivery apps delivering small packets, our male massage therapists transport heavy professional foldable massage tables, freshly sanitized single-use linens, and natural oils. The 2-hour minimum lead time ensures that therapists have ample transit time across city traffic and arrive relaxed, punctual, and prepared.",
        },
        {
          q: "Which cities and areas do you currently serve?",
          a: "We currently provide home wellness sessions across select areas in Delhi NCR (South Delhi, Gurgaon, Noida, Dwarka), Mumbai (Bandra, BKC, Andheri, Powai, Juhu, Worli), Bengaluru (Indiranagar, Koramangala, Whitefield, HSR Layout), and Hyderabad (Banjara Hills, Jubilee Hills, Hitec City). Enter your 6-digit PIN in our location bar to confirm availability.",
        },
      ],
    },
    {
      category: "The Home Wellness Experience",
      items: [
        {
          q: "Do I need to own a massage table or provide towels?",
          a: "No. The therapist brings an ergonomic, portable massage table with a face cradle, single-use disposable sheets, sanitized cotton towels, cold-pressed oils, and soothing ambient music. You only need to provide approximately 7ft x 4ft of floor space in a private room.",
        },
        {
          q: "How should I prepare my home before the therapist arrives?",
          a: "Ensure a quiet room with a comfortable room temperature (adjust AC or fans). Taking a warm shower before the session is strongly recommended to relax surface muscles and maintain personal hygiene.",
        },
        {
          q: "Will the oils make a mess on my floor or furniture?",
          a: "Not at all. The therapist sets up a wide waterproof protective barrier beneath the massage bed. All oils, towels, and disposable supplies are kept strictly on the designated setup and packed into a sanitary disposal bag after the session.",
        },
      ],
    },
    {
      category: "Therapists & Safety Standards",
      items: [
        {
          q: "Who are the therapists?",
          a: "All ZOVRA therapists are certified male masseurs with professional diplomas in Swedish, Deep Tissue, or sports kinesiology, and an average of 5+ years of experience in luxury hospitality. Every therapist has verified government identification and a police background clearance.",
        },
        {
          q: "What is your policy regarding professional conduct?",
          a: "ZOVRA is an authentic therapeutic wellness and athletic recovery company. All treatments are performed with strict clinical dignity and standard sanitary draping at all times. All services are strictly non-sexual. Any inappropriate solicitation is met with immediate cancellation and permanent blacklisting.",
        },
      ],
    },
    {
      category: "Payment, Pricing & Cancellation",
      items: [
        {
          q: "How does Cash on Delivery (COD) work?",
          a: "You pay nothing upfront. Once the therapist completes your massage session, you pay the exact bill amount directly to the therapist via Cash or UPI (Google Pay, PhonePe, Paytm).",
        },
        {
          q: "Are there any hidden travel charges or tip requirements?",
          a: "Pricing is 100% transparent. Travel and setup are completely FREE for bookings of ₹2,000 and above (or a nominal ₹49 for smaller sessions). There is zero pressure to tip.",
        },
        {
          q: "What is your cancellation and rescheduling policy?",
          a: "You can cancel or reschedule for free directly from your My Account dashboard up to 2 hours prior to the scheduled slot. If cancelled after the therapist has already departed for your location, a nominal convenience fee of ₹150 may apply.",
        },
      ],
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Help & Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Find answers to common questions about our home massage services, equipment, and safety.
          </p>
        </div>

        {/* Section Accordions */}
        <div className="space-y-12">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-4">
              <h2 className="text-base font-black text-zovra-black uppercase tracking-wider pb-2 border-b border-gray-200">
                {sec.category}
              </h2>

              <div className="space-y-3">
                {sec.items.map((item, itemIdx) => (
                  <details
                    key={itemIdx}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 open:bg-zovra-lightGrey/40 transition-colors"
                  >
                    <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-zovra-black cursor-pointer list-none select-none">
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-zovra-deepBlue shrink-0" />
                        <span>{item.q}</span>
                      </div>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                        ▾
                      </span>
                    </summary>
                    <p className="text-xs text-gray-600 leading-relaxed mt-3 pl-6 pt-2 border-t border-gray-100">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="p-8 rounded-3xl bg-zovra-lightGrey text-center space-y-3">
          <h3 className="text-base font-bold text-zovra-black">Still Have Questions?</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Our wellness concierge is available every day from 9:00 AM to 9:00 PM to help you select the ideal therapy.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
