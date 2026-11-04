"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight, Check } from "lucide-react";
import { Service } from "@/lib/types";
import { useCart } from "@/context/CartContext";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { addItem } = useCart();
  const primaryDuration = service.durations[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(service, primaryDuration.durationMinutes);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <Link href={`/services/${service.slug}`} className="block relative aspect-4/3 overflow-hidden bg-gray-100">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {service.tag && (
              <span className="bg-zovra-black/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                {service.tag}
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-xs text-zovra-deepBlue text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {service.category}
            </span>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-zovra-black text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <Clock className="w-3 h-3 text-zovra-deepBlue" />
            <span>
              {service.durations.map((d) => `${d.durationMinutes}m`).join(" / ")}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500 font-bold gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{service.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 font-medium">({service.reviewCount} reviews)</span>
          </div>

          {/* Title & Description */}
          <div>
            <Link
              href={`/services/${service.slug}`}
              className="text-base font-bold text-zovra-black hover:text-zovra-deepBlue transition-colors line-clamp-1"
            >
              {service.name}
            </Link>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {service.shortDescription}
            </p>
          </div>

          {/* Top Inclusions Highlight */}
          <div className="space-y-1 pt-1 text-[11px] text-gray-600">
            {service.inclusions.slice(0, 2).map((inc, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <Check className="w-3 h-3 text-zovra-deepBlue shrink-0" />
                <span className="truncate">{inc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="p-5 pt-0 border-t border-gray-100/80 mt-2">
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Starts from</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-zovra-black">
                ₹{service.basePrice.toLocaleString()}
              </span>
              {primaryDuration.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  ₹{primaryDuration.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/services/${service.slug}`}
              className="px-3 py-2 rounded-xl border border-gray-300 hover:border-black text-xs font-semibold text-zovra-black transition-colors"
            >
              Details
            </Link>
            <button
              onClick={handleQuickAdd}
              className="px-4 py-2 rounded-xl bg-zovra-black text-white hover:bg-black/85 text-xs font-semibold transition-transform active:scale-95 flex items-center gap-1"
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

