import React from "react";
import { Sparkles, MapPin, CalendarClock, Smile } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Sparkles,
      title: "Choose Your Massage",
      description: "Select from our 10 specialised men's therapies, tailored duration, and optional add-ons.",
    },
    {
      step: "02",
      icon: MapPin,
      title: "Select Your Location",
      description: "Enter your home address or apartment in Delhi NCR, Mumbai, Bengaluru, or Hyderabad.",
    },
    {
      step: "03",
      icon: CalendarClock,
      title: "Pick Your Slot",
      description: "Choose convenient slots today or later with our strict 2-hour advance booking guarantee.",
    },
    {
      step: "04",
      icon: Smile,
      title: "Relax & Recharge",
      description: "Your verified therapist arrives with portable bed and supplies. Pay via COD afterwards.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zovra-deepBlue bg-zovra-softBlue/60 px-3.5 py-1 rounded-full">
            Effortless Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zovra-black tracking-tight">
            How ZOVRA Works
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Booking a five-star men&apos;s wellness session in the privacy of your home takes less than 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-zovra-lightGrey/50 rounded-2xl p-7 border border-gray-100 flex flex-col justify-between hover:bg-white hover:border-gray-300 hover:shadow-card transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-gray-300 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zovra-black">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-[11px] font-semibold text-zovra-deepBlue">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

