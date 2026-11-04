"use client";

import React, { useState } from "react";
import { X, MapPin, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

export default function LocationModal() {
  const { isLocationModalOpen, setIsLocationModalOpen, checkPin, currentPin, serviceStatus, isChecking } =
    useLocation();
  const [pinInput, setPinInput] = useState(currentPin || "");
  const [result, setResult] = useState(serviceStatus);

  if (!isLocationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const res = await checkPin(pinInput);
    setResult(res);
  };

  const handleQuickSelect = async (pin: string) => {
    setPinInput(pin);
    const res = await checkPin(pin);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLocationModalOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-zovra-softBlue/60 text-zovra-deepBlue">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zovra-black">Check Service Location</h3>
                <p className="text-xs text-gray-500">Enter your 6-digit delivery PIN code</p>
              </div>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 110001, 400050, 560038"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-zovra-black font-medium tracking-wider"
              />
              <button
                type="submit"
                disabled={isChecking || pinInput.length !== 6}
                className="px-5 py-2.5 rounded-xl bg-zovra-black text-white text-xs font-semibold hover:bg-black/85 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {isChecking ? "Checking..." : "Verify"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Feedback */}
          {result && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                result.serviceable
                  ? "bg-green-50/80 border-green-200 text-green-900"
                  : "bg-red-50/80 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-start gap-2">
                {result.serviceable ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{result.message}</p>
                  {result.serviceable && (
                    <p className="text-[11px] text-green-700 mt-1">
                      Minimum 2-hour advance booking is required. Cash on Delivery is available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Popular Cities */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Popular Operational Areas:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { city: "Delhi (CP)", pin: "110001" },
                { city: "Gurgaon (DLF)", pin: "122002" },
                { city: "Mumbai (Bandra)", pin: "400050" },
                { city: "Bengaluru (Indiranagar)", pin: "560038" },
              ].map((item) => (
                <button
                  key={item.pin}
                  onClick={() => handleQuickSelect(item.pin)}
                  className="px-3 py-2 rounded-lg bg-zovra-lightGrey hover:bg-zovra-softBlue/50 text-left text-xs font-medium text-zovra-black border border-gray-200/80 transition-colors flex items-center justify-between"
                >
                  <span>{item.city}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{item.pin}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="text-xs font-semibold text-gray-500 hover:text-black"
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

