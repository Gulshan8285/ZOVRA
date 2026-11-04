import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { getReviews } from "@/lib/db";

export const metadata = {
  title: "Verified Customer Reviews & Ratings | ZOVRA Men's Home Wellness",
  description:
    "Read genuine, unedited feedback from verified male clients who booked home massage services with ZOVRA in Delhi NCR, Mumbai, Bengaluru, and Hyderabad.",
};

export default function ReviewsPage() {
  const reviews = getReviews({ status: "APPROVED" });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Stats Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Real Experiences
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Client Reviews & Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Every review displayed below comes from an authentic, completed home massage appointment.
          </p>
        </div>

        {/* Rating Breakdown Card */}
        <div className="bg-zovra-lightGrey/60 rounded-3xl p-6 sm:p-8 border border-gray-200/90 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-5xl font-black text-zovra-black tracking-tight">
              {avgRating}
            </div>
            <div className="space-y-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Based on {reviews.length}+ verified home sessions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              100% Verified Clients
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200">
              <CheckCircle2 className="w-4 h-4 text-zovra-deepBlue" />
              Certified Male Therapists
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Booking
                  </span>
                </div>

                <p className="text-xs text-gray-700 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zovra-black">{rev.customerName}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-zovra-deepBlue font-semibold truncate">
                  {rev.serviceName}
                </div>

                {rev.therapistReply && (
                  <div className="p-2.5 rounded-xl bg-zovra-lightGrey text-[11px] text-gray-600 border-l-2 border-zovra-deepBlue mt-2">
                    <strong className="text-zovra-black">ZOVRA Therapist:</strong>{" "}
                    {rev.therapistReply}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85 transition-colors shadow-lg"
          >
            <span>Experience ZOVRA at Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

