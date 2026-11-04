import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { getServiceBySlug, getAllServices, getReviews } from "@/lib/db";
import ServiceBookingWidget from "./ServiceBookingWidget";
import ServiceCard from "@/components/ServiceCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found - ZOVRA" };

  return {
    title: `${service.name} for Men at Home | ZOVRA Wellness`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getAllServices()
    .filter((s) => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  const reviews = getReviews({ serviceId: service.id, status: "APPROVED" });

  return (
    <div className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-gray-500 gap-2">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-black transition-colors">
            Men&apos;s Massage Services
          </Link>
          <span>/</span>
          <span className="text-zovra-black font-semibold">{service.name}</span>
        </nav>

        {/* Main Grid: Left Details & Right Sticky Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Images, Descriptions, Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Gallery / Image Showcase */}
            <div className="space-y-4">
              <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-card border border-gray-100 bg-gray-100">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {service.tag && (
                    <span className="bg-zovra-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                      {service.tag}
                    </span>
                  )}
                  <span className="bg-white/95 text-zovra-deepBlue text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {service.gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {service.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-16/10 rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${service.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-500 font-bold gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{service.rating}</span>
                </div>
                <span className="text-gray-500 font-medium">({service.reviewCount} verified client reviews)</span>
                <span>•</span>
                <span className="text-zovra-deepBlue font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {service.durations.map((d) => `${d.durationMinutes} mins`).join(" or ")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
                {service.name}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {service.fullDescription}
              </p>
            </div>

            {/* What is Included */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zovra-black flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-zovra-deepBlue" />
                <span>What is Included in Your Home Session</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.inclusions.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-zovra-lightGrey/70 border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zovra-deepBlue mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zovra-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-zovra-deepBlue" />
                <span>Key Physiological & Recovery Benefits</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.benefits.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-zovra-softBlue/20 border border-zovra-softBlue/60 flex items-start gap-2.5 text-xs text-gray-800"
                  >
                    <CheckCircle className="w-4 h-4 text-zovra-deepBlue shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who is this suitable for */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zovra-black flex items-center gap-2">
                <Info className="w-5 h-5 text-zovra-deepBlue" />
                <span>Who This Treatment Is Suitable For</span>
              </h3>
              <div className="space-y-2">
                {service.suitableFor.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-gray-200 flex items-center gap-2.5 text-xs text-gray-700"
                  >
                    <ChevronRight className="w-4 h-4 text-zovra-deepBlue shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zovra-black">
                Easy Home Preparation
              </h3>
              <div className="p-5 rounded-2xl bg-zovra-lightGrey border border-gray-200 space-y-3">
                {service.preparation.map((prep, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-white text-zovra-black font-bold flex items-center justify-center shrink-0 border border-gray-300">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed mt-0.5">{prep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Service Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zovra-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zovra-deepBlue" />
                <span>Professional Wellness Standards & Ethics</span>
              </h3>
              <div className="p-5 rounded-2xl bg-zovra-softBlue/30 border border-zovra-softBlue space-y-2.5 text-xs text-zovra-deepBlue leading-relaxed">
                <p className="font-bold">ZOVRA Ethical Care Pledge:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Strictly non-sexual, certified clinical & relaxation bodywork only.</li>
                  <li>Standard sanitary draping is strictly maintained throughout the therapy.</li>
                  <li>All equipment, linens, and oils are sealed and single-use sanitized.</li>
                  <li>Zero tipping pressure: pay only the exact bill via Cash on Delivery.</li>
                </ul>
              </div>
            </div>

            {/* Service Specific FAQs */}
            {service.faqs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zovra-black flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-zovra-deepBlue" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white space-y-1.5">
                      <div className="text-xs font-bold text-zovra-black">{faq.question}</div>
                      <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews for this specific therapy */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zovra-black">
                  Verified Reviews for {service.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{service.rating} / 5.0</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zovra-lightGrey/50 border border-gray-200 text-center text-xs text-gray-500">
                  Reviews are collected from verified clients after session completion.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Verified Client
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 italic">&ldquo;{rev.comment}&rdquo;</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                        <span className="font-semibold text-zovra-black">{rev.customerName}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      {rev.therapistReply && (
                        <div className="p-2.5 rounded-lg bg-zovra-lightGrey text-[11px] text-gray-600 mt-2 border-l-2 border-zovra-deepBlue">
                          <strong className="text-zovra-black">ZOVRA Therapist:</strong>{" "}
                          {rev.therapistReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Sticky Booking Card (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ServiceBookingWidget service={service} />
          </div>
        </div>

        {/* Related Treatments */}
        {relatedServices.length > 0 && (
          <div className="pt-16 border-t border-gray-100 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zovra-deepBlue">
                Recommended Pairings
              </span>
              <h2 className="text-2xl font-black text-zovra-black">
                Related Men&apos;s Treatments
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <ServiceCard key={rel.id} service={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
