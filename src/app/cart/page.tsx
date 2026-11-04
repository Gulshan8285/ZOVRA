"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    removeItem,
    clearCart,
    subtotal,
    travelCharge,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    totalAmount,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setCouponSuccess(res.message);
      setInputCoupon("");
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-zovra-lightGrey flex items-center justify-center mx-auto text-gray-400">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-zovra-black">Your Cart is Empty</h1>
            <p className="text-sm text-gray-500">
              You haven&apos;t added any wellness therapies to your booking cart yet.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85 transition-colors shadow-md"
          >
            <span>Explore Men&apos;s Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black mb-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-3xl font-black text-zovra-black">Review Your Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Items (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs space-y-4"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={item.serviceImage}
                      alt={item.serviceName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-zovra-black">
                          {item.serviceName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="font-semibold bg-zovra-lightGrey px-2.5 py-0.5 rounded text-zovra-black">
                            {item.durationMinutes} mins
                          </span>
                          <span>•</span>
                          <span className="font-bold text-zovra-black">
                            ₹{item.basePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                {item.selectedAddOns.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Selected Add-ons:
                    </span>
                    {item.selectedAddOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between text-xs text-gray-700"
                      >
                        <span>+ {addon.name}</span>
                        <span className="font-bold">+₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Total for this session</span>
                  <span className="text-base font-black text-zovra-black">
                    ₹{item.totalItemPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Bill Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-zovra-lightGrey/60 rounded-3xl p-6 sm:p-7 border border-gray-200/90 space-y-6">
            <h2 className="text-lg font-black text-zovra-black">Order Summary</h2>

            {/* Promo Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zovra-deepBlue" />
                <span>Promo Code</span>
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-green-200">
                  <div className="text-xs">
                    <span className="font-bold text-green-700">{couponCode}</span>
                    <span className="text-gray-500 ml-2">(10% off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'WELCOME10'"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-zovra-black font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zovra-black text-white text-xs font-bold rounded-xl hover:bg-black/85"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-green-600">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-3 border-t border-gray-200/80 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Service Subtotal</span>
                <span className="font-bold text-zovra-black">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel & Equipment Setup</span>
                <span>
                  {travelCharge === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    `₹${travelCharge}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Welcome Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-black text-zovra-black">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Callout */}
            <div className="p-3.5 rounded-xl bg-white border border-zovra-softBlue text-xs text-zovra-deepBlue flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Cash on Delivery (COD):</strong> Pay only after your session is completed to your satisfaction.
              </span>
            </div>

            {/* Proceed Button */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-zovra-black text-white text-sm font-bold hover:bg-black/85 transition-transform active:scale-[0.99] shadow-md"
            >
              <span>Proceed to Booking (Address & Slot)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
