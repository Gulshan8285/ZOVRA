import React from "react";
import Link from "next/link";
import { Phone, Mail, Clock, ShieldCheck, MapPin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-zovra-black text-gray-300 pt-16 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" inverted />
            <p className="text-zovra-softBlue text-sm font-medium tracking-wide">
              Relax. Recharge. Rejuvenate.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              ZOVRA is India&apos;s premier men&apos;s home wellness brand. We deliver verified,
              professionally trained male massage therapists equipped with portable massage beds,
              organic oils, and hospital-grade sanitisation straight to your doorstep.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-zovra-softBlue" />
                100% Cash on Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                <Clock className="w-3.5 h-3.5 text-zovra-softBlue" />
                2-Hour Advance Slots
              </span>
            </div>
          </div>

          {/* Men's Massage Services */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Men&apos;s Massage Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/deep-tissue-massage" className="hover:text-white transition-colors">
                  Deep Tissue Massage
                </Link>
              </li>
              <li>
                <Link href="/services/swedish-massage" className="hover:text-white transition-colors">
                  Swedish Relaxation
                </Link>
              </li>
              <li>
                <Link href="/services/sports-recovery-massage" className="hover:text-white transition-colors">
                  Sports Recovery
                </Link>
              </li>
              <li>
                <Link href="/services/head-neck-shoulder-massage" className="hover:text-white transition-colors">
                  Head, Neck & Shoulder
                </Link>
              </li>
              <li>
                <Link href="/services/back-pain-relief-massage" className="hover:text-white transition-colors">
                  Back Pain Relief
                </Link>
              </li>
              <li>
                <Link href="/services/full-body-relaxation-massage" className="hover:text-white transition-colors">
                  Full Body Recharge
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-zovra-softBlue hover:underline text-xs font-semibold">
                  View All 10 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore ZOVRA
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About ZOVRA
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account / Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-zovra-softBlue shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-zovra-softBlue shrink-0 mt-0.5" />
                <span>care@zovra.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-zovra-softBlue shrink-0 mt-0.5" />
                <span>9:00 AM – 9:00 PM (Daily)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zovra-softBlue shrink-0 mt-0.5" />
                <span>Serving Delhi NCR, Mumbai, Bengaluru & Hyderabad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Conduct Notice */}
        <div className="py-6 border-b border-gray-800/80 text-xs text-gray-400 leading-relaxed">
          <p>
            <strong className="text-white">Professional Wellness Notice:</strong> ZOVRA is an exclusive,
            therapeutic home massage brand committed to the highest standards of hospitality and sports
            bodywork. All services are strictly non-sexual. Our certified male therapists adhere to strict
            professional boundaries and ethical protocols. Any inappropriate request will result in
            immediate service termination and reporting.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} ZOVRA Wellness Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors">
              Cancellation & Refund Policy
            </Link>
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

