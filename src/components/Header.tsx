"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";

export default function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { customer, isLoggedIn } = useAuth();
  const { currentPin, serviceStatus, setIsLocationModalOpen } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Men's Massage" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/reviews", label: "Reviews" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zovra-black text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zovra-softBlue" />
            <span className="font-medium tracking-wide">
              100% Certified Male Therapists | Hospital-Grade Sanitization | Cash on Delivery
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-gray-300">
            <span>Operating 9:00 AM – 9:00 PM</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-6">
            <Logo size="md" />

            {/* Location selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zovra-lightGrey hover:bg-zovra-softBlue/40 text-xs font-medium text-zovra-black border border-gray-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-zovra-deepBlue" />
              <span>
                {currentPin
                  ? `${serviceStatus?.city || "PIN"} (${currentPin})`
                  : "Check City / PIN"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-zovra-black font-semibold border-b-2 border-zovra-black pb-0.5"
                      : "text-gray-600 hover:text-zovra-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Location Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="sm:hidden p-2 text-gray-700 hover:text-zovra-black"
              aria-label="Location"
            >
              <MapPin className="w-5 h-5" />
            </button>

            {/* Account Link */}
            {isLoggedIn ? (
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-zovra-black text-xs font-semibold text-zovra-black transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-zovra-deepBlue text-white flex items-center justify-center text-[10px]">
                  {customer?.name ? customer.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline">
                  {customer?.name ? customer.name.split(" ")[0] : "My Account"}
                </span>
              </Link>
            ) : (
              <Link
                href="/account"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zovra-black bg-zovra-lightGrey hover:bg-gray-200 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-zovra-black text-white hover:bg-black/90 transition-transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zovra-deepBlue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-zovra-black"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-5 shadow-lg space-y-3 animate-fadeIn">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Service Location:</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLocationModalOpen(true);
                }}
                className="text-xs font-semibold text-zovra-deepBlue flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                {currentPin ? `${serviceStatus?.city || "PIN"} (${currentPin})` : "Check City / PIN"}
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    pathname === link.href
                      ? "bg-zovra-lightGrey text-zovra-black font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>Admin Dashboard</span>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">Staff</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

