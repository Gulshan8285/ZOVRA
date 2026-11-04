"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Service } from "@/lib/types";
import ServiceCard from "@/components/ServiceCard";

interface ServicesClientProps {
  initialServices: Service[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");

  const categories = ["All", "Therapeutic", "Relaxation", "Recovery", "Specialty"];
  const durationOptions = ["All", "45", "60", "90", "120"];

  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      // Category filter
      if (selectedCategory !== "All" && service.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDesc = service.shortDescription.toLowerCase().includes(query);
        const matchesInclusions = service.inclusions.some((inc) => inc.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesInclusions) return false;
      }

      // Duration filter
      if (selectedDuration !== "All") {
        const targetDuration = parseInt(selectedDuration, 10);
        const hasDuration = service.durations.some((d) => d.durationMinutes === targetDuration);
        if (!hasDuration) return false;
      }

      return true;
    });
  }, [initialServices, selectedCategory, searchQuery, selectedDuration]);

  return (
    <div className="space-y-8">
      {/* Filters & Search Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zovra-lightGrey/60 border border-gray-200/80 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by massage or symptoms..."
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-zovra-black placeholder:text-gray-400 focus:outline-none focus:border-zovra-black shadow-2xs"
            />
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Duration:</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {durationOptions.map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedDuration === dur
                      ? "bg-zovra-black text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {dur === "All" ? "All" : `${dur}m`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-gray-200/60">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-zovra-black text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>
          Showing <strong>{filteredServices.length}</strong> massage treatments
        </span>
        {(selectedCategory !== "All" || searchQuery || selectedDuration !== "All") && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setSelectedDuration("All");
            }}
            className="text-zovra-deepBlue hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-zovra-lightGrey/40 border border-dashed border-gray-300 space-y-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-gray-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zovra-black">No matching massage treatments</h3>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

