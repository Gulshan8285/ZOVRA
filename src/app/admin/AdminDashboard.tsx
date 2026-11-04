"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Search,
  X,
  RefreshCw,
  LogOut,
} from "lucide-react";
import Logo from "@/components/Logo";
import { Booking, Service, Therapist, LocationArea, Review, BookingStatus, PaymentStatus } from "@/lib/types";

export default function AdminDashboard() {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "services" | "therapists" | "locations" | "reviews" | "settings"
  >("overview");

  // Stats state
  const [stats, setStats] = useState<{
    totalBookings: number;
    todayBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    totalRevenue: number;
    outstandingCod: number;
    averageRating: number;
  } | null>(null);

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [locations, setLocations] = useState<LocationArea[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters for bookings
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Edit / Action Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [therapistAssignId, setTherapistAssignId] = useState<string>("");
  const [statusUpdateVal, setStatusUpdateVal] = useState<BookingStatus | "">("");
  const [paymentUpdateVal, setPaymentUpdateVal] = useState<PaymentStatus | "">("");
  const [internalNotesVal, setInternalNotesVal] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string>("");

  // Service Edit state
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Review reply state
  const [replyReviewId, setReplyReviewId] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  // Check persisted admin session
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("zovra_admin_auth");
      if (savedAuth === "true") {
        setIsAdminAuth(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "zovra2026" || adminPassword === "admin") {
      setIsAdminAuth(true);
      localStorage.setItem("zovra_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Invalid admin access key. Use 'zovra2026'");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    localStorage.removeItem("zovra_admin_auth");
  };

  // Fetch all admin data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, servicesRes, therapistsRes, locationsRes, reviewsRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/bookings"),
          fetch("/api/services?all=true"),
          fetch("/api/admin/therapists"),
          fetch("/api/admin/locations"),
          fetch("/api/reviews?status=ALL"),
        ]);

      const [statsData, bookingsData, servicesData, therapistsData, locationsData, reviewsData] =
        await Promise.all([
          statsRes.json(),
          bookingsRes.json(),
          servicesRes.json(),
          therapistsRes.json(),
          locationsRes.json(),
          reviewsRes.json(),
        ]);

      if (statsData.success) setStats(statsData.stats);
      if (bookingsData.success) setBookings(bookingsData.bookings);
      if (servicesData.success) setServices(servicesData.services);
      if (therapistsData.success) setTherapists(therapistsData.therapists);
      if (locationsData.success) setLocations(locationsData.locations);
      if (reviewsData.success) setReviews(reviewsData.reviews);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchAllData();
    }
  }, [isAdminAuth]);

  // Handle booking status and assignment updates
  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusUpdateVal || selectedBooking.status,
          assignedTherapistId: therapistAssignId || selectedBooking.assignedTherapistId,
          paymentStatus: paymentUpdateVal || selectedBooking.paymentStatus,
          internalNotes: internalNotesVal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess("Booking updated successfully!");
        setTimeout(() => {
          setActionSuccess("");
          setSelectedBooking(null);
          fetchAllData();
        }, 800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle review status update
  const handleReviewAction = async (id: string, status: "APPROVED" | "REJECTED" | "PENDING", reply?: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, therapistReply: reply }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
        setReplyReviewId("");
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    if (dateFilter && b.appointmentDate !== dateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.id.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.toLowerCase().includes(q);
      const matchService = b.serviceName.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchService) return false;
    }
    return true;
  });

  // Login Gate
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-zovra-black text-white flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-8 sm:p-10 max-w-md w-full space-y-6 text-center shadow-2xl">
          <div className="space-y-2">
            <Logo size="lg" inverted />
            <h1 className="text-xl font-black text-white mt-2">Admin & Dispatch Control</h1>
            <p className="text-xs text-gray-400">
              Authorized personnel only. Enter master PIN to access appointment dispatching.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block text-left mb-1">
                Security Passphrase
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password (e.g. zovra2026)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-zovra-softBlue text-center font-mono"
              />
            </div>

            {authError && <p className="text-xs text-red-400">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white text-zovra-black font-black text-xs hover:bg-gray-100 transition-colors shadow-lg"
            >
              Authenticate & Enter
            </button>

            <p className="text-[11px] text-gray-400">
              Demo Access Passphrase: <code className="text-zovra-softBlue font-bold">zovra2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zovra-lightGrey/50 text-zovra-black flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-zovra-black text-white sticky top-0 z-30 px-6 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" inverted />
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zovra-softBlue text-zovra-deepBlue">
              Operations & Dispatch
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={fetchAllData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
            >
              View Live Website ↗
            </Link>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
          {[
            { id: "overview", label: "Overview Metrics" },
            { id: "bookings", label: `Bookings (${bookings.length})` },
            { id: "services", label: `Services (${services.length})` },
            { id: "therapists", label: `Therapists (${therapists.length})` },
            { id: "locations", label: `Service Areas (${locations.length})` },
            { id: "reviews", label: `Reviews (${reviews.length})` },
            { id: "settings", label: "Business Rules" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-zovra-black text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW METRICS */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Total Bookings</span>
                <div className="text-3xl font-black text-zovra-black">{stats.totalBookings}</div>
                <span className="text-[10px] text-gray-500">All-time database count</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Today&apos;s Bookings</span>
                <div className="text-3xl font-black text-zovra-deepBlue">{stats.todayBookings}</div>
                <span className="text-[10px] text-gray-500">Scheduled for today</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Completed Services</span>
                <div className="text-3xl font-black text-green-700">{stats.completedBookings}</div>
                <span className="text-[10px] text-green-600 font-medium">Successfully delivered</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Total Real Revenue</span>
                <div className="text-3xl font-black text-zovra-black">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <span className="text-[10px] text-gray-500">From completed services</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Outstanding COD</span>
                <div className="text-3xl font-black text-amber-600">
                  ₹{stats.outstandingCod.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-700">Pending therapist collection</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Cancelled Bookings</span>
                <div className="text-3xl font-black text-red-600">{stats.cancelledBookings}</div>
                <span className="text-[10px] text-gray-500">Customer cancellations</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Active Therapists</span>
                <div className="text-3xl font-black text-zovra-deepBlue">
                  {therapists.filter((t) => t.isAvailable).length} / {therapists.length}
                </div>
                <span className="text-[10px] text-gray-500">Ready for dispatch</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase">Average Rating</span>
                <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
                  <span>{stats.averageRating}</span>
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <span className="text-[10px] text-gray-500">From verified client reviews</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-zovra-black">Operational Quick Actions</h3>
                <p className="text-xs text-gray-500">Jump directly to pending tasks.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab("bookings");
                    setStatusFilter("PENDING");
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100"
                >
                  Review Pending Bookings
                </button>
                <button
                  onClick={() => {
                    setActiveTab("bookings");
                    setStatusFilter("CONFIRMED");
                  }}
                  className="px-4 py-2 rounded-xl bg-zovra-softBlue text-zovra-deepBlue text-xs font-bold hover:bg-zovra-softBlue/80"
                >
                  Assign Therapists
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKING MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-zovra-black">All Bookings</h2>
                <p className="text-xs text-gray-500">
                  Search, filter, assign therapists, and update payment statuses.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, phone..."
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black w-48 sm:w-60"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="THERAPIST_ASSIGNED">Therapist Assigned</option>
                  <option value="ON_THE_WAY">On The Way</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none"
                />

                {(statusFilter !== "ALL" || searchQuery || dateFilter) && (
                  <button
                    onClick={() => {
                      setStatusFilter("ALL");
                      setSearchQuery("");
                      setDateFilter("");
                    }}
                    className="text-xs text-gray-500 hover:text-black font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Customer & Phone</th>
                    <th className="py-3 px-3">Service & Duration</th>
                    <th className="py-3 px-3">Date & Slot</th>
                    <th className="py-3 px-3">PIN / City</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Therapist</th>
                    <th className="py-3 px-3">Amount & Payment</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        No bookings match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-zovra-lightGrey/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-zovra-black whitespace-nowrap">
                          {b.id}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-zovra-black">{b.customerName}</div>
                          <div className="text-gray-400 font-mono text-[11px]">{b.customerPhone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-zovra-black truncate max-w-[140px]">
                            {b.serviceName}
                          </div>
                          <div className="text-gray-400 text-[10px]">{b.durationMinutes} mins</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-medium">{b.appointmentDate}</div>
                          <div className="text-gray-400 text-[10px]">{b.timeSlot}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-medium">{b.address.pinCode}</div>
                          <div className="text-gray-400 text-[10px]">{b.address.city}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              b.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : b.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : b.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-zovra-softBlue text-zovra-deepBlue"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {b.assignedTherapistName ? (
                            <span className="font-semibold text-zovra-deepBlue">
                              {b.assignedTherapistName}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-zovra-black">
                            ₹{b.totalAmount.toLocaleString()}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              b.paymentStatus === "COLLECTED"
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {b.paymentStatus === "COLLECTED" ? "COD Collected" : "COD Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setStatusUpdateVal(b.status);
                              setTherapistAssignId(b.assignedTherapistId || "");
                              setPaymentUpdateVal(b.paymentStatus);
                              setInternalNotesVal(b.internalNotes || "");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-zovra-black text-white hover:bg-black/85 font-semibold text-[11px]"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SERVICES CATALOG MANAGEMENT */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-zovra-black">Services Management</h2>
                <p className="text-xs text-gray-500">
                  Update service base pricing, descriptions, inclusions, and active status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl border border-gray-200 flex items-start gap-4 hover:border-gray-300 transition-all bg-white"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <Image src={s.image} alt={s.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zovra-black">{s.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="text-gray-500 text-[11px] font-medium">
                      Category: {s.category} • Starts at ₹{s.basePrice}
                    </div>
                    <p className="text-gray-600 line-clamp-2 text-[11px] leading-relaxed">
                      {s.shortDescription}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {s.durations.map((d) => `${d.durationMinutes}m: ₹${d.price}`).join(" | ")}
                      </span>
                      <button
                        onClick={() => setEditingService(s)}
                        className="px-3 py-1 rounded-lg border border-gray-300 hover:border-black font-semibold text-[11px]"
                      >
                        Edit Price / Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. THERAPIST MANAGEMENT */}
        {activeTab === "therapists" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-zovra-black">Certified Therapists Roster</h2>
                <p className="text-xs text-gray-500">
                  Manage certified male therapists, verified backgrounds, and dispatch availability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapists.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-gray-200 flex items-start gap-4 bg-white"
                >
                  <div className="relative w-18 h-18 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    <Image src={t.photo} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zovra-black">{t.name}</span>
                      <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                        Verified Male Masseur
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <span>{t.phone}</span> • <span>{t.experienceYears} Years Exp</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{t.rating} ({t.reviewCount} client ratings)</span>
                    </div>
                    <div className="text-gray-500 text-[10px] pt-1">
                      Specializations: {t.specializations.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LOCATIONS & PIN CODES */}
        {activeTab === "locations" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-zovra-black">Serviceable Locations & Travel Charges</h2>
              <p className="text-xs text-gray-500">
                Operating metro zones, serviced PIN codes, and travel fee policies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zovra-deepBlue" />
                      <span className="font-bold text-sm text-zovra-black">{loc.city}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
                      Active Zone
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">
                      Supported PIN Codes ({loc.pinCodes.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {loc.pinCodes.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-zovra-lightGrey text-gray-700 font-mono text-[10px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 text-gray-600">
                    Travel Fee: <strong>{loc.travelCharge === 0 ? "FREE" : `₹${loc.travelCharge}`}</strong> (Waived for orders above ₹2,000)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. REVIEWS MODERATION */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-zovra-black">Customer Reviews Moderation</h2>
              <p className="text-xs text-gray-500">
                Approve or moderate honest customer reviews from completed bookings.
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-zovra-black">{rev.customerName}</span>
                      <span className="text-gray-400 text-[11px]">• {rev.serviceName}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-gray-700 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                  {rev.therapistReply && (
                    <div className="p-3 rounded-xl bg-zovra-lightGrey text-[11px] text-gray-700 border-l-2 border-zovra-deepBlue">
                      <strong>ZOVRA Response:</strong> {rev.therapistReply}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Booking ID: {rev.bookingId}</span>

                    <div className="flex items-center gap-2">
                      {rev.status !== "APPROVED" && (
                        <button
                          onClick={() => handleReviewAction(rev.id, "APPROVED")}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white font-bold"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== "REJECTED" && (
                        <button
                          onClick={() => handleReviewAction(rev.id, "REJECTED")}
                          className="px-3 py-1 rounded-lg border border-red-200 text-red-600 font-semibold"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => setReplyReviewId(rev.id)}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 font-semibold"
                      >
                        Add Official Reply
                      </button>
                    </div>
                  </div>

                  {replyReviewId === rev.id && (
                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official response to customer..."
                        className="flex-1 p-2 rounded-xl border border-gray-300 text-xs"
                      />
                      <button
                        onClick={() => handleReviewAction(rev.id, rev.status, replyText)}
                        className="px-4 py-2 bg-zovra-black text-white text-xs font-bold rounded-xl"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BUSINESS RULES SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-zovra-black">Operational Rules & Policies</h2>
              <p className="text-xs text-gray-500">Platform operational settings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-zovra-lightGrey space-y-2">
                <span className="font-bold text-zovra-black text-sm block">
                  Strict 2-Hour Advance Booking Rule
                </span>
                <p className="text-gray-600 leading-relaxed">
                  Active server-side rule: Enforces that no customer can book an appointment less than 2 hours in advance of current server time. This ensures male therapists have travel, table preparation, and transit buffers.
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px]">
                  Enforced on Frontend & Server API
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zovra-lightGrey space-y-2">
                <span className="font-bold text-zovra-black text-sm block">
                  Operating Hours
                </span>
                <p className="text-gray-600 leading-relaxed">
                  Working hours configured from 09:00 AM to 09:00 PM across all operational zones (Delhi NCR, Mumbai, Bengaluru, Hyderabad).
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  Daily 09:00 AM – 09:00 PM
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Management Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedBooking(null)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono font-bold text-xs text-gray-400">
                    {selectedBooking.id}
                  </span>
                  <h3 className="text-lg font-black text-zovra-black mt-0.5">Manage Appointment</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Info preview */}
                <div className="p-3 rounded-xl bg-zovra-lightGrey space-y-1">
                  <div className="font-bold text-zovra-black">{selectedBooking.serviceName}</div>
                  <div className="text-gray-500">
                    {selectedBooking.customerName} ({selectedBooking.customerPhone}) • {selectedBooking.appointmentDate} at {selectedBooking.timeSlot}
                  </div>
                  <div className="text-gray-600">
                    Address: {selectedBooking.address.houseNumber}, {selectedBooking.address.building}, {selectedBooking.address.city} - {selectedBooking.address.pinCode}
                  </div>
                </div>

                {/* Status selector */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Update Booking Status</label>
                  <select
                    value={statusUpdateVal}
                    onChange={(e) => setStatusUpdateVal(e.target.value as BookingStatus)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="THERAPIST_ASSIGNED">THERAPIST_ASSIGNED</option>
                    <option value="ON_THE_WAY">ON_THE_WAY</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                {/* Therapist Assign */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Assign Therapist</label>
                  <select
                    value={therapistAssignId}
                    onChange={(e) => setTherapistAssignId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="">-- Choose Therapist --</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.phone}) - {t.experienceYears}y exp
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment status */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">COD Payment Collection</label>
                  <select
                    value={paymentUpdateVal}
                    onChange={(e) => setPaymentUpdateVal(e.target.value as PaymentStatus)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold"
                  >
                    <option value="PENDING_COLLECTION">PENDING COLLECTION (₹{selectedBooking.totalAmount})</option>
                    <option value="COLLECTED">COLLECTED (Payment verified)</option>
                  </select>
                </div>

                {/* Internal notes */}
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Internal Operations Notes</label>
                  <textarea
                    rows={2}
                    value={internalNotesVal}
                    onChange={(e) => setInternalNotesVal(e.target.value)}
                    placeholder="e.g. Customer requested extra back pressure..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                {actionSuccess && (
                  <div className="p-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-center">
                    {actionSuccess}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateBooking}
                    className="px-6 py-2 rounded-xl bg-zovra-black text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingService(null)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-black text-zovra-black">
                  Edit {editingService.name}
                </h3>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={editingService.basePrice}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        basePrice: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingService.shortDescription}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={editingService.isActive}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isActiveCheck" className="font-bold text-gray-700">
                    Active & Visible on Website
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/services", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editingService),
                      });
                      setEditingService(null);
                      fetchAllData();
                    }}
                    className="px-5 py-2 rounded-xl bg-zovra-black text-white font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
