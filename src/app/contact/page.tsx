"use client";

import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Client Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zovra-black tracking-tight">
            Contact ZOVRA Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Have questions about an upcoming booking, service customizations, or corporate wellness inquiries? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zovra-lightGrey/70 border border-gray-200/90 space-y-6">
              <h2 className="text-base font-black text-zovra-black">Direct Communication</h2>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zovra-black block">Telephone Support</span>
                    <p className="text-sm font-semibold text-zovra-black mt-0.5">+91 98765 43210</p>
                    <span className="text-[10px] text-gray-400">Available 9:00 AM – 9:00 PM Daily</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zovra-black block">Email Inquiries</span>
                    <p className="text-sm font-semibold text-zovra-black mt-0.5">care@zovra.in</p>
                    <span className="text-[10px] text-gray-400">Average response time: &lt; 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zovra-black block">Operating Hours</span>
                    <p className="mt-0.5 font-medium">Monday to Sunday: 09:00 AM – 09:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zovra-black block">Operating Hubs</span>
                    <p className="mt-0.5 leading-relaxed">
                      Delhi NCR, Mumbai, Bengaluru, and Hyderabad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/90 shadow-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-black text-zovra-black">Send a Direct Message</h2>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zovra-black">Message Received!</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Thank you, {name}. A ZOVRA wellness specialist will review your request and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sen"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9811234567"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">How can we help you? *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your question, special requirements, or feedback..."
                    className="w-full p-3.5 rounded-xl border border-gray-300 text-zovra-black focus:outline-none focus:border-zovra-black leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-zovra-black text-white font-bold text-xs hover:bg-black/85 flex items-center gap-2 shadow-md"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

