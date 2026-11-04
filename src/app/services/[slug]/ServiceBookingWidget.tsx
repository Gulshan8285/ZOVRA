"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Service, SelectedAddOn } from "@/lib/types";
import { useCart } from "@/context/CartContext";

interface Props {
  service: Service;
}

export default function ServiceBookingWidget({ service }: Props) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [selectedDuration, setSelectedDuration] = useState<number>(
    service.durations[0]?.durationMinutes || 60
  );
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // Selected variant
  const currentVariant =
    service.durations.find((d) => d.durationMinutes === selectedDuration) ||
    service.durations[0];

  const toggleAddOn = (addon: { id: string; name: string; price: number; durationAddMinutes: number }) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [
          ...prev,
          {
            id: addon.id,
            name: addon.name,
            price: addon.price,
            durationAddMinutes: addon.durationAddMinutes,
          },
        ];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const totalDuration =
    selectedDuration + selectedAddOns.reduce((sum, item) => sum + item.durationAddMinutes, 0);
  const calculatedTotal = currentVariant.price + addOnsTotal;

  const handleAddToCart = () => {
    addItem(service, selectedDuration, selectedAddOns);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleBookNow = () => {
    addItem(service, selectedDuration, selectedAddOns);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-card p-6 sm:p-7 space-y-6">
      {/* Title & Price Header */}
      <div className="pb-5 border-b border-gray-100 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Customize Treatment
          </span>
          <h2 className="text-xl font-black text-zovra-black">{service.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-zovra-deepBlue" />
            <span>Total Duration: {totalDuration} mins</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-medium">Payable Amount</span>
          <div className="text-2xl font-black text-zovra-black">
            ₹{calculatedTotal.toLocaleString()}
          </div>
          {currentVariant.originalPrice && (
            <div className="text-xs text-gray-400 line-through">
              ₹{(currentVariant.originalPrice + addOnsTotal).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* 1. Duration Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zovra-black block">
          1. Select Treatment Duration
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {service.durations.map((variant) => {
            const isSelected = selectedDuration === variant.durationMinutes;
            return (
              <button
                key={variant.durationMinutes}
                type="button"
                onClick={() => setSelectedDuration(variant.durationMinutes)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "border-zovra-black bg-zovra-softBlue/20 shadow-2xs ring-1 ring-zovra-black"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zovra-black">
                    {variant.durationMinutes} mins
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-zovra-black text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-extrabold text-zovra-black mt-1">
                  ₹{variant.price.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Optional Approved Add-ons */}
      {service.addOns.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zovra-black">
              2. Optional Upgrades & Add-ons
            </label>
            <span className="text-[10px] text-zovra-deepBlue font-semibold bg-zovra-softBlue/60 px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>

          <div className="space-y-2">
            {service.addOns.map((addon) => {
              const isChecked = selectedAddOns.some((a) => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isChecked
                      ? "border-zovra-black bg-zovra-softBlue/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? "bg-zovra-black border-zovra-black text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-bold text-zovra-black">{addon.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 pl-6 leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-zovra-black shrink-0">
                    +₹{addon.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleBookNow}
          className="w-full py-3.5 px-4 rounded-xl bg-zovra-black text-white font-bold text-sm hover:bg-black/85 transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-md"
        >
          <span>Book Now (Slot & Address)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:border-black font-semibold text-xs text-zovra-black transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isAddedFeedback ? "Added to Cart!" : "Add to Cart"}</span>
        </button>
      </div>

      {/* Trust & Policy Assurance */}
      <div className="pt-2 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zovra-deepBlue shrink-0" />
          <span>
            <strong>100% Cash on Delivery:</strong> Pay only after service completion.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zovra-deepBlue shrink-0" />
          <span>
            <strong>Lead Time:</strong> Minimum 2 hours advance booking required.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zovra-deepBlue shrink-0" />
          <span>
            <strong>Free Cancellation:</strong> Cancel hassle-free up to 2 hours before the slot.
          </span>
        </div>
      </div>
    </div>
  );
}
