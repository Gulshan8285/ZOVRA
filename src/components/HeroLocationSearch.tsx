"use client";

import React, { useState } from "react";
import { MapPin, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

export default function HeroLocationSearch() {
  const { checkPin, currentPin, serviceStatus, isChecking } = useLocation();
  const [pinInput, setPinInput] = useState(currentPin || "");
  const [result, setResult] = useState(serviceStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    const res = await checkPin(pinInput);
    setResult(res);
  };

  return (
    <div className="space-y-2.5">
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-1.5 rounded-2xl bg-white shadow-card border border-gray-200/90 focus-within:border-zovra-black transition-all"
      >
        <div className="pl-3.5 pr-2 text-zovra-deepBlue">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          maxLength={6}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit delivery PIN (e.g. 110001)"
          className="w-full bg-transparent text-xs sm:text-sm font-medium text-zovra-black focus:outline-none placeholder:text-gray-400 py-2"
        />
        <button
          type="submit"
          disabled={isChecking || pinInput.length !== 6}
          className="px-4 py-2.5 rounded-xl bg-zovra-black text-white text-xs font-semibold hover:bg-black/85 disabled:opacity-50 transition-colors flex items-center gap-1 shrink-0"
        >
          <span>{isChecking ? "Checking" : "Check PIN"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {result && (
        <div
          className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
            result.serviceable
              ? "bg-green-50 text-green-900 border border-green-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {result.serviceable ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{result.message}</span>
        </div>
      )}
    </div>
  );
}

