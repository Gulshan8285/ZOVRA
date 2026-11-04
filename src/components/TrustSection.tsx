import React from "react";
import { ShieldCheck, Home, Clock, Banknote, Headphones } from "lucide-react";

export default function TrustSection() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "Verified Male Therapists",
      description: "Police verified, background checked, and certified with 5+ years experience.",
    },
    {
      icon: Home,
      title: "Complete Home Setup",
      description: "Therapist brings portable ergonomic bed, fresh linens, and organic oils.",
    },
    {
      icon: Clock,
      title: "2-Hour Advance Slots",
      description: "Dynamic schedule management ensuring on-time arrivals every single booking.",
    },
    {
      icon: Banknote,
      title: "100% Cash on Delivery",
      description: "Zero upfront payment risk. Pay only after your massage therapy concludes.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Live customer assistance 7 days a week from 9:00 AM to 9:00 PM.",
    },
  ];

  return (
    <section className="border-y border-gray-100 bg-zovra-lightGrey/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {trustPillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-start space-y-2.5 p-3 rounded-xl hover:bg-white/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-zovra-softBlue text-zovra-deepBlue flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zovra-black">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

