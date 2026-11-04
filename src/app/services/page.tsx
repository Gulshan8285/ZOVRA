import React from "react";
import Link from "next/link";
import { getAllServices } from "@/lib/db";
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Men's Massage Services & Therapies | ZOVRA Home Wellness",
  description:
    "Explore ZOVRA's complete catalog of professional men's massage therapies at home. Swedish Relaxation, Deep Tissue, Sports Recovery, Back Pain Relief, Foot Reflexology, and Balinese bodywork.",
};

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center text-xs text-gray-500 gap-2">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zovra-black font-semibold">Men&apos;s Massage Services</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
              Full Therapy Catalogue
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zovra-black tracking-tight">
              Men&apos;s Home Massage Therapies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Tailored specifically for male musculature, desk strain, and athletic recovery.
              Delivered directly to your home with hospital-grade sanitisation and full spa equipment.
            </p>
          </div>
        </div>

        {/* Client filter & services grid */}
        <ServicesClient initialServices={services} />
      </div>
    </div>
  );
}

