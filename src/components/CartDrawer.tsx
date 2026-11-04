"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShieldCheck, Tag, ArrowRight, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
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
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  if (!isCartOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideIn">
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-zovra-lightGrey/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-zovra-black">Your Cart</span>
              <span className="text-xs bg-zovra-softBlue text-zovra-deepBlue font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? "Session" : "Sessions"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zovra-lightGrey flex items-center justify-center mx-auto text-gray-400">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zovra-black">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a therapeutic men&apos;s massage service to begin your wellness journey.
                  </p>
                </div>
                <Link
                  href="/services"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-6 py-2.5 rounded-full bg-zovra-black text-white text-xs font-semibold hover:bg-black/80 transition-colors"
                >
                  Explore Massage Services
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-18 h-18 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={item.serviceImage}
                            alt={item.serviceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-zovra-black truncate">
                              {item.serviceName}
                            </h4>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="font-medium bg-zovra-lightGrey px-2 py-0.5 rounded">
                              {item.durationMinutes} mins
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-zovra-black">
                              ₹{item.basePrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Addons */}
                      {item.selectedAddOns.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Add-ons included:
                          </span>
                          {item.selectedAddOns.map((addon) => (
                            <div
                              key={addon.id}
                              className="flex items-center justify-between text-xs text-gray-600"
                            >
                              <span>+ {addon.name}</span>
                              <span className="font-medium">+₹{addon.price}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-500">Item Total</span>
                        <span className="font-bold text-sm text-zovra-black">
                          ₹{item.totalItemPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <button
                      onClick={clearCart}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="p-4 rounded-xl bg-zovra-lightGrey border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zovra-black">
                    <Tag className="w-3.5 h-3.5 text-zovra-deepBlue" />
                    <span>Apply Promo Code</span>
                  </div>
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-green-200">
                      <div className="text-xs">
                        <span className="font-bold text-green-700">{couponCode}</span>
                        <span className="text-gray-500 ml-2">(10% off applied)</span>
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
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-zovra-black uppercase tracking-wider focus:outline-none focus:border-zovra-black"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-zovra-black text-white text-xs font-semibold rounded-lg hover:bg-black/80 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-green-600">{couponSuccess}</p>}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Service Subtotal</span>
                    <span className="font-medium text-zovra-black">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel & Setup Fee</span>
                    <span>
                      {travelCharge === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `₹${travelCharge}`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Welcome Discount (10%)</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold text-zovra-black">
                    <span>Final Payable Amount</span>
                    <span className="text-base text-zovra-black">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cash on Delivery Notice */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-zovra-softBlue/40 border border-zovra-softBlue text-xs text-zovra-deepBlue">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>100% Cash on Delivery:</strong> Pay only after your massage session is completed.
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white space-y-3">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-zovra-black text-white text-sm font-semibold hover:bg-black/90 transition-transform active:scale-[0.99] shadow-md"
              >
                <span>Proceed to Booking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-zovra-black transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

