"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
  LogOut,
  Plus,
  Trash2,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Booking, Address, BookingStatus } from "@/lib/types";
import SubmitReviewModal from "@/components/SubmitReviewModal";

export default function AccountDashboard() {
  const { customer, isLoggedIn, logout, sendOtp, verifyOtp, updateProfile, saveAddress, deleteAddress } =
    useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "addresses" | "profile" | "reviews" | "support"
  >("overview");
  const [bookingFilter, setBookingFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">(
    "ALL"
  );

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

  // Cancellation modal
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelling, setCancelling] = useState<boolean>(false);

  // New Address modal
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: customer?.name || "",
    phone: customer?.phone || "",
    houseNumber: "",
    building: "",
    street: "",
    landmark: "",
    city: "Delhi NCR",
    state: "Delhi",
    pinCode: "",
    addressType: "Home",
  });

  // Profile Edit state
  const [profileName, setProfileName] = useState<string>(customer?.name || "");
  const [profileEmail, setProfileEmail] = useState<string>(customer?.email || "");
  const [profileSavedMsg, setProfileSavedMsg] = useState<string>("");

  // Login Form State (when not logged in)
  const [loginPhone, setLoginPhone] = useState<string>("");
  const [loginOtp, setLoginOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpHint, setOtpHint] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Fetch bookings when logged in
  const fetchBookings = async () => {
    if (!customer?.phone) return;
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/bookings?phone=${encodeURIComponent(customer.phone)}`);
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (customer?.phone) {
      fetchBookings();
    }
  }, [customer]);

  // Handle Cancel Booking
  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${cancelModalBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          cancellationReason: cancelReason || "Customer requested cancellation",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelModalBooking(null);
        setCancelReason("");
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  // Handle Add Address
  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.houseNumber || !newAddress.pinCode) return;
    const ok = await saveAddress(newAddress);
    if (ok) {
      setShowAddressModal(false);
      setNewAddress({
        fullName: customer?.name || "",
        phone: customer?.phone || "",
        houseNumber: "",
        building: "",
        street: "",
        landmark: "",
        city: "Delhi NCR",
        state: "Delhi",
        pinCode: "",
        addressType: "Home",
      });
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile(profileName, profileEmail);
    if (ok) {
      setProfileSavedMsg("Profile updated successfully!");
      setTimeout(() => setProfileSavedMsg(""), 3000);
    }
  };

  // Handle Non-logged-in Login
  const handleLoginSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await sendOtp(loginPhone);
    setLoginLoading(false);
    if (res.success) {
      setOtpSent(true);
      if (res.code) setOtpHint(res.code);
    } else {
      setLoginError(res.message || "Failed to send OTP.");
    }
  };

  const handleLoginVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await verifyOtp(loginPhone, loginOtp);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || "Incorrect code.");
    }
  };

  // If user is not logged in, render clean OTP login card
  if (!isLoggedIn || !customer) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-zovra-lightGrey/40">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-elevated p-8 sm:p-10 max-w-md w-full space-y-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zovra-deepBlue bg-zovra-softBlue/60 px-2.5 py-1 rounded-full">
              Customer Portal
            </span>
            <h1 className="text-2xl font-black text-zovra-black">Login to ZOVRA</h1>
            <p className="text-xs text-gray-500">
              Manage appointments, track verified therapists, and view completed session invoices.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleLoginSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block text-left mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-xs text-gray-600 font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98112 34567"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-300 text-xs text-zovra-black font-semibold focus:outline-none focus:border-zovra-black"
                  />
                </div>
              </div>

              {loginError && <p className="text-xs text-red-500 text-left">{loginError}</p>}

              <button
                type="submit"
                disabled={loginLoading || loginPhone.length !== 10}
                className="w-full py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors shadow-md"
              >
                {loginLoading ? "Sending OTP..." : "Continue with Mobile OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginVerify} className="space-y-4">
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900 text-left">
                OTP sent to <strong>+91 {loginPhone}</strong>.
                {otpHint && (
                  <span className="block mt-1 font-bold text-green-950">
                    (Dev Test Code: {otpHint})
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block text-left mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base font-mono tracking-[0.3em] text-center text-zovra-black font-bold focus:outline-none focus:border-zovra-black"
                />
              </div>

              {loginError && <p className="text-xs text-red-500 text-left">{loginError}</p>}

              <button
                type="submit"
                disabled={loginLoading || loginOtp.length !== 6}
                className="w-full py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 disabled:opacity-50 transition-colors shadow-md"
              >
                {loginLoading ? "Logging in..." : "Verify & Access Account"}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-gray-500 hover:text-black"
              >
                Change mobile number
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
            By proceeding, you agree to ZOVRA&apos;s Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "ALL") return true;
    if (bookingFilter === "UPCOMING") {
      return ["PENDING", "CONFIRMED", "THERAPIST_ASSIGNED", "ON_THE_WAY", "IN_PROGRESS"].includes(
        b.status
      );
    }
    if (bookingFilter === "COMPLETED") return b.status === "COMPLETED";
    if (bookingFilter === "CANCELLED") return b.status === "CANCELLED";
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Pending</span>;
      case "CONFIRMED":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Confirmed</span>;
      case "THERAPIST_ASSIGNED":
        return <span className="bg-zovra-softBlue text-zovra-deepBlue px-2.5 py-0.5 rounded-full font-bold text-[10px]">Therapist Assigned</span>;
      case "ON_THE_WAY":
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] animate-pulse">On The Way</span>;
      case "IN_PROGRESS":
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] animate-pulse">In Progress</span>;
      case "COMPLETED":
        return <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Completed</span>;
      case "CANCELLED":
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Cancelled</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-zovra-lightGrey/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Greeting Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-zovra-black text-white font-black text-xl flex items-center justify-center shrink-0">
              {customer.name ? customer.name.charAt(0).toUpperCase() : "Z"}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-black text-zovra-black">
                  {customer.name || "Valued Client"}
                </h1>
                <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {customer.phone} {customer.email ? `• ${customer.email}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 hover:border-red-500 hover:text-red-600 text-xs font-semibold text-gray-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Two Column Layout: Left Nav & Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs space-y-1">
            {[
              { id: "overview", label: "Dashboard Overview", icon: User },
              { id: "bookings", label: "My Bookings", icon: Calendar, badge: bookings.length },
              { id: "addresses", label: "Saved Addresses", icon: MapPin },
              { id: "profile", label: "Profile Settings", icon: ShieldCheck },
              { id: "support", label: "Customer Care & Help", icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-zovra-black text-white shadow-xs"
                      : "text-gray-700 hover:bg-zovra-lightGrey"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                    <span className="text-gray-400 text-xs font-medium">Total Bookings</span>
                    <div className="text-2xl font-black text-zovra-black">{bookings.length}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                    <span className="text-gray-400 text-xs font-medium">Upcoming Sessions</span>
                    <div className="text-2xl font-black text-zovra-deepBlue">
                      {
                        bookings.filter((b) =>
                          ["PENDING", "CONFIRMED", "THERAPIST_ASSIGNED", "ON_THE_WAY"].includes(
                            b.status
                          )
                        ).length
                      }
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                    <span className="text-gray-400 text-xs font-medium">Completed Sessions</span>
                    <div className="text-2xl font-black text-green-700">
                      {bookings.filter((b) => b.status === "COMPLETED").length}
                    </div>
                  </div>
                </div>

                {/* Recent Booking Highlight */}
                {bookings.length > 0 ? (
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <h3 className="text-sm font-black text-zovra-black">Latest Appointment</h3>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="text-xs text-zovra-deepBlue font-bold hover:underline"
                      >
                        View All Bookings →
                      </button>
                    </div>

                    {(() => {
                      const latest = bookings[0];
                      return (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                              <Image
                                src={latest.serviceImage}
                                alt={latest.serviceName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zovra-black">{latest.serviceName}</span>
                                {getStatusBadge(latest.status)}
                              </div>
                              <p className="text-gray-500">
                                {latest.appointmentDate} at {latest.timeSlot} ({latest.durationMinutes}m)
                              </p>
                              <p className="font-mono text-[11px] text-gray-400">{latest.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-zovra-black">
                              ₹{latest.totalAmount.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">
                              Cash on Delivery
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-zovra-lightGrey flex items-center justify-center mx-auto text-gray-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-zovra-black">No Bookings Yet</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Discover therapeutic men&apos;s home massage sessions delivered by certified therapists.
                    </p>
                    <Link
                      href="/services"
                      className="inline-block px-6 py-2.5 rounded-full bg-zovra-black text-white text-xs font-bold hover:bg-black/85"
                    >
                      Book a Massage Therapy
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* MY BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <h2 className="text-lg font-black text-zovra-black">My Bookings</h2>
                    <p className="text-xs text-gray-500">Track and manage your appointments.</p>
                  </div>

                  {/* Filter Subtabs */}
                  <div className="flex items-center gap-1 bg-zovra-lightGrey p-1 rounded-xl">
                    {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setBookingFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          bookingFilter === filter
                            ? "bg-white text-zovra-black shadow-xs"
                            : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {filter.charAt(0) + filter.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingBookings ? (
                  <div className="py-16 text-center text-xs text-gray-400">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                  <div className="py-16 text-center text-xs text-gray-400 space-y-3">
                    <p>No bookings found in this category.</p>
                    <Link
                      href="/services"
                      className="inline-block px-5 py-2 rounded-full bg-zovra-black text-white text-xs font-bold"
                    >
                      Explore Services
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-300 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-zovra-black">
                              {b.id}
                            </span>
                            <span>•</span>
                            <span className="text-xs text-gray-500">
                              Booked on {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>{getStatusBadge(b.status)}</div>
                        </div>

                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            <Image
                              src={b.serviceImage}
                              alt={b.serviceName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1 text-xs">
                            <h3 className="text-sm font-bold text-zovra-black">{b.serviceName}</h3>
                            <div className="text-gray-600 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-zovra-deepBlue" />
                              <span>{b.appointmentDate} at {b.timeSlot}</span>
                              <span>({b.durationMinutes} mins)</span>
                            </div>
                            <div className="text-gray-500 truncate">
                              Address: {b.address.houseNumber}, {b.address.building}, {b.address.city}
                            </div>
                            <div className="font-bold text-zovra-black pt-1">
                              ₹{b.totalAmount.toLocaleString()} • Cash on Delivery ({b.paymentStatus === "COLLECTED" ? "Paid" : "Pending Collection"})
                            </div>
                          </div>
                        </div>

                        {/* Assigned Therapist Details if Assigned */}
                        {b.assignedTherapistName && (
                          <div className="p-3 rounded-xl bg-zovra-softBlue/30 border border-zovra-softBlue text-xs text-zovra-deepBlue flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-zovra-deepBlue" />
                              <span>
                                Assigned Therapist: <strong>{b.assignedTherapistName}</strong>
                              </span>
                            </div>
                            {b.assignedTherapistPhone && (
                              <span className="font-semibold text-gray-700">
                                {b.assignedTherapistPhone}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                          {/* Cancel option */}
                          {!["COMPLETED", "CANCELLED"].includes(b.status) && (
                            <button
                              onClick={() => setCancelModalBooking(b)}
                              className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                            >
                              Cancel Booking
                            </button>
                          )}

                          {/* Review option if completed */}
                          {b.status === "COMPLETED" && (
                            <button
                              onClick={() => setReviewModalBooking(b)}
                              className="px-4 py-1.5 rounded-lg bg-zovra-softBlue text-zovra-deepBlue hover:bg-zovra-softBlue/80 font-bold flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 fill-zovra-deepBlue" />
                              <span>Write a Review</span>
                            </button>
                          )}

                          {/* Re-book */}
                          <Link
                            href={`/services/${b.serviceId}`}
                            className="px-4 py-1.5 rounded-lg bg-zovra-black text-white hover:bg-black/85 font-semibold"
                          >
                            Book Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-black text-zovra-black">Saved Delivery Addresses</h2>
                    <p className="text-xs text-gray-500">Manage your home and work addresses.</p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zovra-black text-white text-xs font-bold hover:bg-black/85"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {!customer.savedAddresses || customer.savedAddresses.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400">
                    No saved addresses. Your address will be saved automatically upon your next booking.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customer.savedAddresses.map((addr, i) => (
                      <div
                        key={addr.id || i}
                        className="p-4 rounded-2xl border border-gray-200 bg-white relative space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zovra-deepBlue bg-zovra-softBlue px-2.5 py-0.5 rounded-full text-[10px]">
                            {addr.addressType || "Home"}
                          </span>
                          {addr.id && (
                            <button
                              onClick={() => deleteAddress(addr.id!)}
                              className="text-gray-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="font-bold text-zovra-black">{addr.fullName} ({addr.phone})</p>
                        <p className="text-gray-600 leading-relaxed">
                          {addr.houseNumber}, {addr.building}, {addr.street}, {addr.city} - {addr.pinCode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-black text-zovra-black">Profile Management</h2>
                  <p className="text-xs text-gray-500">Update your contact details and preferences.</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Verified Mobile Number
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={customer.phone}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500 font-mono font-bold"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Mobile numbers are verified via OTP for appointment security.
                    </span>
                  </div>

                  {profileSavedMsg && (
                    <div className="p-3 rounded-xl bg-green-50 text-green-700 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{profileSavedMsg}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-zovra-black text-white text-xs font-bold hover:bg-black/85"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CUSTOMER SUPPORT TAB */}
            {activeTab === "support" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-black text-zovra-black">Customer Care & Support</h2>
                  <p className="text-xs text-gray-500">We are here to assist with every aspect of your session.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zovra-lightGrey space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-zovra-black">
                      <Phone className="w-4 h-4 text-zovra-deepBlue" />
                      <span>Telephone Helpline</span>
                    </div>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <span className="text-[10px] text-gray-400">Available 9:00 AM – 9:00 PM Daily</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-zovra-lightGrey space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-zovra-black">
                      <Mail className="w-4 h-4 text-zovra-deepBlue" />
                      <span>Email Concierge</span>
                    </div>
                    <p className="text-gray-600">care@zovra.in</p>
                    <span className="text-[10px] text-gray-400">Response guaranteed within 2 hours</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zovra-softBlue/30 border border-zovra-softBlue space-y-2 text-xs text-zovra-deepBlue leading-relaxed">
                  <span className="font-bold block">Cancellation & Rescheduling Reminder:</span>
                  <p className="text-gray-700">
                    Appointments can be cancelled or rescheduled free of charge up to 2 hours prior to your scheduled slot.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalBooking && (
        <SubmitReviewModal
          booking={reviewModalBooking}
          isOpen={!!reviewModalBooking}
          onClose={() => setReviewModalBooking(null)}
          onSuccess={() => fetchBookings()}
        />
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCancelModalBooking(null)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
              <h3 className="text-lg font-black text-zovra-black">Cancel Appointment?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to cancel your appointment for <strong>{cancelModalBooking.serviceName}</strong> on {cancelModalBooking.appointmentDate} at {cancelModalBooking.timeSlot}?
              </p>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Sudden travel, schedule conflict..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelBooking}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddressModal(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
              <h3 className="text-lg font-black text-zovra-black">Add New Address</h3>

              <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Flat / House No. *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.houseNumber}
                    onChange={(e) => setNewAddress({ ...newAddress, houseNumber: e.target.value })}
                    placeholder="e.g. 501, Tower C"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Building / Society *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.building}
                    onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })}
                    placeholder="e.g. The Magnolias"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Street / Area *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="e.g. Sector 42"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddress.pinCode}
                      onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                      placeholder="122002"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Address Type</label>
                    <select
                      value={newAddress.addressType}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressType: e.target.value as "Home" | "Work" | "Other",
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-zovra-black text-white font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
