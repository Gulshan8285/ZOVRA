"use client";

import React, { useState } from "react";
import { X, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { Booking } from "@/lib/types";

interface Props {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitReviewModal({ booking, isOpen, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [serviceQuality, setServiceQuality] = useState<number>(5);
  const [therapistProf, setTherapistProf] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          serviceQualityRating: serviceQuality,
          therapistRating: therapistProf,
          experienceRating: rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(data.error || "Failed to submit review.");
      }
    } catch {
      setError("Network error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-fadeIn space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                Verified Booking
              </span>
              <h3 className="text-lg font-black text-zovra-black mt-1">
                Review Your ZOVRA Experience
              </h3>
              <p className="text-xs text-gray-500">
                {booking.serviceName} • {booking.id}
              </p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-zovra-black">Thank You for Your Feedback!</h4>
              <p className="text-xs text-gray-500">
                Your review has been submitted and helps us maintain five-star wellness standards.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Overall Star Rating */}
              <div className="space-y-1.5 text-center sm:text-left">
                <label className="text-xs font-bold text-zovra-black block">
                  Overall Rating
                </label>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 stroke-1"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{rating} of 5</span>
                </div>
              </div>

              {/* Sub ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Therapy Quality (Pressure & Technique)
                  </label>
                  <select
                    value={serviceQuality}
                    onChange={(e) => setServiceQuality(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs text-zovra-black"
                  >
                    <option value={5}>5 - Outstanding</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Needs Improvement</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Therapist Professionalism & Hygiene
                  </label>
                  <select
                    value={therapistProf}
                    onChange={(e) => setTherapistProf(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs text-zovra-black"
                  >
                    <option value={5}>5 - Highly Professional</option>
                    <option value={4}>4 - Good Conduct</option>
                    <option value={3}>3 - Acceptable</option>
                    <option value={2}>2 - Below Expectation</option>
                    <option value={1}>1 - Unacceptable</option>
                  </select>
                </div>
              </div>

              {/* Written review */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zovra-black block">
                  Written Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell other men about your experience with the therapist, equipment, pressure, and relief..."
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-zovra-black focus:outline-none focus:border-zovra-black leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-zovra-black text-white text-xs font-bold hover:bg-black/85 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Verified Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
