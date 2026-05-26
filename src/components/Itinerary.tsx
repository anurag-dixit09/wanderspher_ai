"use client";

import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export interface Destination {
  id: number;
  city: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  date: Date;
}

interface ItineraryProps {
  destinations: Destination[];
}

const EXPERIENCES = [
  { title: "Local Food Tour", emoji: "🍜", duration: "3 hours" },
  { title: "Museum Visit", emoji: "🏛️", duration: "2 hours" },
  { title: "City Sightseeing", emoji: "🏙️", duration: "4 hours" },
  { title: "Sunset Cruise", emoji: "🌅", duration: "2.5 hours" },
  { title: "Historic Walk", emoji: "🚶‍♂️", duration: "1.5 hours" }
];

const TRANSITS = [
  "✈️ 2h 15m Flight",
  "🚆 3h 30m High-speed Train",
  "🚗 4h Scenic Drive",
  "✈️ 1h 45m Flight",
  "🚆 2h 20m High-speed Train"
];

export default function Itinerary({ destinations }: ItineraryProps) {
  const validDestinations = destinations.filter(d => d.city.trim() !== "");

  if (validDestinations.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 relative overflow-hidden"
    >
      <h2 className="text-2xl font-medium text-gray-900 mb-8">Your Journey Timeline</h2>
      
      <div className="relative ml-4 md:ml-8">
        {/* The continuous vertical line */}
        <div className="absolute top-4 bottom-4 left-[11px] w-0.5 bg-navy/20"></div>

        <div className="space-y-12">
          {validDestinations.map((dest, index) => {
            const exp = EXPERIENCES[index % EXPERIENCES.length];
            const transit = TRANSITS[index % TRANSITS.length];
            const isLast = index === validDestinations.length - 1;

            return (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                className="relative"
              >
                {/* City Node */}
                <div className="flex items-start gap-6">
                  {/* Circle Indicator */}
                  <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-coral border-4 border-white shadow-sm shrink-0"></div>
                  
                  {/* Card Content */}
                  <div className="flex-1 -mt-1.5">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[19px] font-medium text-gray-900">{dest.city}</h3>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {format(dest.date, 'MMM do, yyyy')}
                      </span>
                    </div>

                    {/* Activity Card */}
                    <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                        {exp.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-coral tracking-wider uppercase mb-0.5">Suggested Experience</p>
                        <p className="text-gray-900 font-medium">{exp.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{exp.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transit Indicator (if not last) */}
                {!isLast && (
                  <div className="absolute -bottom-8 left-11 bg-white px-3 py-1.5 rounded-full border border-gray-100 text-[13px] font-medium text-gray-600 shadow-sm z-10 flex items-center gap-1.5">
                    {transit}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
