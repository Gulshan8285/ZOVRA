"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/lib/types";

interface SlotItem {
  time: string;
  displayTime: string;
  available: boolean;
  reason?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, travelCharge, discount, couponCode, totalAmount, clearCart } = useCart();
  const { customer, isLoggedIn, sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Address state
  const [address, setAddress] = useState<Address>({
    fullName: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    houseNumber: "",
    building: "",
    street: "",
    landmark: "",
    city: "Delhi NCR",
    state: "Delhi",
    pinCode: "",
    addressType: "Home",
    instructions: "",
  });

  const [pinValidation, setPinValidation] = useState<{
    validating: boolean;
    serviceable: boolean | null;
    message: string;
  }>({
    validating: false,
    serviceable: null,
    message: "",
  });

  // Date & Slot state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // OTP Verification state
  const [otpPhone, setOtpPhone] = useState<string>(customer?.phone || "");
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpDevHint, setOtpDevHint] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  // Agreement & Submission
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>("");

  // Initialize dates
  const dateOptions = React.useMemo(() => {
    const dates: { dateStr: string; label: string; subLabel: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      let label = "";
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else label = d.toLocaleDateString("en-US", { weekday: "short" });

      const subLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dates.push({ dateStr, label, subLabel });
    }
    return dates;
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (customer) {
      if (customer.name && !address.fullName) {
        setAddress((prev) => ({ ...prev, fullName: customer.name || "" }));
      }
      if (customer.phone && !address.phone) {
        setAddress((prev) => ({ ...prev, phone: customer.phone }));
        setOtpPhone(customer.phone);
      }
      if (customer.email && !address.email) {
        setAddress((prev) => ({ ...prev, email: customer.email }));
      }
      if (customer.savedAddresses && customer.savedAddresses.length > 0) {
        const defaultAddr = customer.savedAddresses[0];
        setAddress((prev) => ({ ...prev, ...defaultAddr }));
        if (defaultAddr.pinCode) {
          validatePin(defaultAddr.pinCode);
        }
      }
    }
  }, [customer]);

  // Set default date to today
  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].dateStr);
    }
  }, [dateOptions, selectedDate]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${selectedDate}`);
        const data = await res.json();
        if (data.success && data.slots) {
          setAvailableSlots(data.slots);
          // If previously selected slot is no longer available on this date, reset it
          const stillAvailable = data.slots.some(
            (s: SlotItem) => s.displayTime === selectedSlot && s.available
          );
          if (!stillAvailable) {
            setSelectedSlot("");
          }
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  // PIN validation
  const validatePin = async (pin: string) => {
    if (pin.length !== 6) {
      setPinValidation({
        validating: false,
        serviceable: null,
        message: "",
      });
      return;
    }

    setPinValidation({ validating: true, serviceable: null, message: "Verifying PIN..." });
    try {
      const res = await fetch(`/api/serviceability?pin=${pin}`);
      const data = await res.json();
      if (data.serviceable) {
        setPinValidation({
          validating: false,
          serviceable: true,
          message: `Operational in ${data.city}`,
        });
        setAddress((prev) => ({ ...prev, city: data.city || prev.city }));
      } else {
        setPinValidation({
          validating: false,
          serviceable: false,
          message: data.message || "Currently outside our service area.",
        });
      }
    } catch {
      setPinValidation({
        validating: false,
        serviceable: false,
        message: "Network error validating PIN.",
      });
    }
  };

  // If cart is empty, redirect
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zovra-lightGrey flex items-center justify-center mx-auto text-gray-400">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zovra-black">No Treatment Selected</h2>
          <p className="text-xs text-gray-500">
            Please select a massage therapy to proceed with slot booking.
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-2.5 rounded-full bg-zovra-black text-white text-xs font-semibold hover:bg-black/85"
          >
            Explore Services
          </Link>
        </div>
      </div>
    );
  }

  const primaryItem = items[0];

  // Handlers for step progression
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName.trim() || !address.phone.trim() || !address.houseNumber.trim() || !address.pinCode.trim()) {
      alert("Please fill out all required address fields.");
      return;
    }
    if (pinValidation.serviceable === false) {
      alert("We cannot confirm bookings outside our serviceable area. Please enter a serviceable PIN code.");
      return;
    }
    setStep(2);
  };

  const handleSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select an appointment time slot.");
      return;
    }
    // If already logged in, skip OTP step directly to step 4 (review & confirm)
    if (isLoggedIn) {
      setStep(4);
    } else {
      setOtpPhone(address.phone);
      setStep(3);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);
    const res = await sendOtp(otpPhone);
    setOtpLoading(false);
    if (res.success) {
      setOtpSent(true);
      if (res.code) {
        setOtpDevHint(res.code);
      }
    } else {
      setOtpError(res.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);
    const res = await verifyOtp(otpPhone, otpCode);
    setOtpLoading(false);
    if (res.success) {
      setStep(4);
    } else {
      setOtpError(res.error || "Incorrect OTP code.");
    }
  };

  const handleFinalBooking = async () => {
    if (!agreedToTerms) {
      alert("Please accept the Terms & Conditions and Cancellation Policy to confirm your booking.");
      return;
    }

    setSubmitting(true);
    setBookingError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: address.fullName,
          customerPhone: address.phone || otpPhone,
          customerEmail: address.email,
          serviceId: primaryItem.serviceId,
          durationMinutes: primaryItem.durationMinutes,
          selectedAddOns: primaryItem.selectedAddOns,
          appointmentDate: selectedDate,
          timeSlot: selectedSlot,
          address,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        clearCart();
        router.push(`/booking-confirmed/${data.booking.id}`);
      } else {
        setBookingError(data.error || "Failed to create booking.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error creating booking";
      setBookingError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Step Progress Bar */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, title: "Address" },
              { num: 2, title: "Date & Slot" },
              { num: 3, title: "Verification" },
              { num: 4, title: "Confirmation" },
            ].map((s) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPast
                        ? "bg-green-600 text-white"
                        : isCurrent
                        ? "bg-zovra-black text-white ring-4 ring-zovra-softBlue"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      isCurrent ? "text-zovra-black" : "text-gray-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Interactive Step Flow (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Address Selection */}
            {step === 1 && (
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zovra-softBlue text-zovra-deepBlue">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zovra-black">Service Address</h2>
                      <p className="text-xs text-gray-500">
                        Where should our certified therapist visit?
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zovra-deepBlue bg-zovra-softBlue/60 px-3 py-1 rounded-full">
                    Step 1 of 4
                  </span>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Mobile Number (for appointment OTP) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="e.g. 9811234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Flat / House No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.houseNumber}
                        onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                        placeholder="e.g. Flat 402, Tower B"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Society / Building / Apartment Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.building}
                        onChange={(e) => setAddress({ ...address, building: e.target.value })}
                        placeholder="e.g. DLF The Crest"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Street / Area / Sector *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="e.g. Golf Course Road, Sector 54"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={address.pinCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setAddress({ ...address, pinCode: val });
                          validatePin(val);
                        }}
                        placeholder="e.g. 122002"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black font-mono tracking-wider font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={address.city}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Address Type
                      </label>
                      <select
                        value={address.addressType}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            addressType: e.target.value as "Home" | "Work" | "Other",
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Office / Studio</option>
                        <option value="Other">Hotel / Other</option>
                      </select>
                    </div>
                  </div>

                  {/* PIN Validation Feedback */}
                  {pinValidation.message && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        pinValidation.serviceable
                          ? "bg-green-50 text-green-900 border border-green-200"
                          : "bg-red-50 text-red-900 border border-red-200"
                      }`}
                    >
                      {pinValidation.serviceable ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{pinValidation.message}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Landmark / Gate Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark || ""}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="e.g. Near Club House, Ring bell twice"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={pinValidation.serviceable === false}
                      className="px-8 py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <span>Proceed to Date & Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Date & Slot Selection (Strict 2-hour rule) */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zovra-softBlue text-zovra-deepBlue">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zovra-black">Pick Appointment Slot</h2>
                      <p className="text-xs text-gray-500">
                        Strict 2-hour advance booking rule enforced.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>
                </div>

                <form onSubmit={handleSlotSubmit} className="space-y-6">
                  {/* Date Selector Pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zovra-black uppercase tracking-wider block">
                      Select Date
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {dateOptions.map((opt) => {
                        const isSelected = selectedDate === opt.dateStr;
                        return (
                          <button
                            key={opt.dateStr}
                            type="button"
                            onClick={() => setSelectedDate(opt.dateStr)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-zovra-black bg-zovra-black text-white shadow-xs"
                                : "border-gray-200 hover:border-gray-300 bg-white text-zovra-black"
                            }`}
                          >
                            <span className="text-[11px] font-bold block">{opt.label}</span>
                            <span
                              className={`text-[10px] block mt-0.5 ${
                                isSelected ? "text-gray-300" : "text-gray-400"
                              }`}
                            >
                              {opt.subLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2-Hour Advance Notice Banner */}
                  <div className="p-3.5 rounded-xl bg-zovra-softBlue/30 border border-zovra-softBlue text-xs text-zovra-deepBlue flex items-start gap-2.5">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Punctuality Guarantee:</strong> To allow our therapists adequate transit and setup time, slots less than 2 hours from current time are automatically disabled.
                    </span>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zovra-black uppercase tracking-wider block">
                      Select Available Time Slot
                    </label>

                    {loadingSlots ? (
                      <div className="py-12 text-center text-xs text-gray-400">
                        Checking therapist availability...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedSlot === slot.displayTime;
                          return (
                            <button
                              key={slot.displayTime}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot(slot.displayTime)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                !slot.available
                                  ? "bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                  : isSelected
                                  ? "border-zovra-black bg-zovra-softBlue/30 text-zovra-black font-extrabold ring-2 ring-zovra-black"
                                  : "border-gray-200 bg-white hover:border-gray-400 text-zovra-black font-semibold"
                              }`}
                            >
                              <div className="text-xs">{slot.displayTime}</div>
                              {!slot.available && (
                                <div className="text-[9px] text-gray-400 mt-0.5 truncate">
                                  {slot.reason?.includes("Past") ? "Past" : "Unavailable"}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-gray-500 hover:text-black"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedSlot}
                      className="px-8 py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <span>Proceed to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Mobile OTP Authentication */}
            {step === 3 && (
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zovra-softBlue text-zovra-deepBlue">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zovra-black">Mobile Verification</h2>
                      <p className="text-xs text-gray-500">
                        Secure OTP to confirm your appointment ownership.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 max-w-sm">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        placeholder="e.g. 9811234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black font-semibold focus:outline-none focus:border-zovra-black"
                      />
                    </div>

                    {otpError && <p className="text-xs text-red-500">{otpError}</p>}

                    <button
                      type="submit"
                      disabled={otpLoading || otpPhone.length < 10}
                      className="w-full py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors"
                    >
                      {otpLoading ? "Sending OTP..." : "Send Verification Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm">
                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800">
                      OTP sent to <strong>{otpPhone}</strong>.
                      {otpDevHint && (
                        <span className="block mt-1 font-bold text-green-900">
                          (Testing Code: {otpDevHint})
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Enter 6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-mono tracking-[0.3em] text-center text-zovra-black font-bold focus:outline-none focus:border-zovra-black"
                      />
                    </div>

                    {otpError && <p className="text-xs text-red-500">{otpError}</p>}

                    <button
                      type="submit"
                      disabled={otpLoading || otpCode.length !== 6}
                      className="w-full py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors"
                    >
                      {otpLoading ? "Verifying..." : "Verify & Proceed"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs text-gray-500 hover:text-black"
                    >
                      Edit mobile number
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* STEP 4: Final Summary & COD Confirmation */}
            {step === 4 && (
              <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zovra-softBlue text-zovra-deepBlue">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-zovra-black">Final Booking Review</h2>
                      <p className="text-xs text-gray-500">
                        Review appointment details and confirm Cash on Delivery.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Slot</span>
                  </button>
                </div>

                {/* Details summary */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-zovra-lightGrey space-y-2">
                    <div className="font-bold text-zovra-black text-sm">
                      {primaryItem.serviceName}
                    </div>
                    <div className="text-gray-600 flex items-center gap-3">
                      <span>Duration: {primaryItem.durationMinutes} mins</span>
                      <span>•</span>
                      <span>Date: {selectedDate}</span>
                      <span>•</span>
                      <span className="font-bold text-zovra-black">Slot: {selectedSlot}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Delivery Address
                    </span>
                    <p className="font-bold text-zovra-black">{address.fullName} ({address.phone})</p>
                    <p className="text-gray-600">
                      {address.houseNumber}, {address.building}, {address.street}, {address.city} - {address.pinCode}
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="p-4 rounded-2xl border-2 border-zovra-black bg-zovra-softBlue/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-zovra-black text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-black text-sm text-zovra-black">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                      Zero advance payment. Pay the exact bill of ₹{totalAmount.toLocaleString()} directly to your therapist via Cash or UPI after your massage service is completed.
                    </p>
                  </div>

                  {/* Mandatory Agreement Checkbox */}
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-zovra-black focus:ring-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to ZOVRA&apos;s{" "}
                      <Link href="/terms" target="_blank" className="font-semibold text-black underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/cancellation-policy" target="_blank" className="font-semibold text-black underline">
                        Cancellation Policy
                      </Link>
                      . I understand this is a strictly non-sexual therapeutic home wellness service.
                    </span>
                  </label>
                </div>

                {bookingError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-gray-500 hover:text-black"
                  >
                    ← Change Slot
                  </button>
                  <button
                    type="button"
                    disabled={submitting || !agreedToTerms}
                    onClick={handleFinalBooking}
                    className="px-10 py-4 rounded-xl bg-zovra-black text-white font-black text-sm hover:bg-black/85 disabled:opacity-50 transition-transform active:scale-[0.99] shadow-lg flex items-center gap-2"
                  >
                    <span>{submitting ? "Confirming..." : "Confirm Booking (COD)"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Order Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-zovra-lightGrey/60 rounded-3xl p-6 sm:p-7 border border-gray-200/90 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-base font-black text-zovra-black">Selected Treatment</h3>

            <div className="flex gap-3 pb-4 border-b border-gray-200">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={primaryItem.serviceImage}
                  alt={primaryItem.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-zovra-black truncate">
                  {primaryItem.serviceName}
                </h4>
                <div className="text-xs text-gray-500 mt-1">
                  <span>Duration: {primaryItem.durationMinutes} mins</span>
                </div>
                <div className="text-sm font-black text-zovra-black mt-1">
                  ₹{primaryItem.basePrice.toLocaleString()}
                </div>
              </div>
            </div>

            {primaryItem.selectedAddOns.length > 0 && (
              <div className="space-y-1.5 pb-4 border-b border-gray-200 text-xs">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Add-ons:
                </span>
                {primaryItem.selectedAddOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-gray-700">
                    <span>+ {addon.name}</span>
                    <span className="font-semibold">+₹{addon.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Treatment Subtotal</span>
                <span className="font-bold text-zovra-black">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel & Table Setup</span>
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
                  <span>Promo Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-black text-zovra-black">
                <span>Total Payable (COD)</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust Guarantee */}
            <div className="pt-2 border-t border-gray-200 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zovra-deepBlue shrink-0" />
                <span>Pay only after your massage session is complete.</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zovra-deepBlue shrink-0" />
                <span>Punctual arrival with full spa setup and clean towels.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
