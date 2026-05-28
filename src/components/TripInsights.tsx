"use client";

// TripInsights Component - Displays trip cost breakdown, lodging pricing, and routing distances.
import React, { useEffect, useState } from "react";
import { Destination } from "./Itinerary";
import { Hotel } from "@/services/travelApi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface TripInsightsProps {
  destinations: Destination[];
  hotels: Hotel[];
}

function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function TripInsights({ destinations, hotels }: TripInsightsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validDestinations = destinations.filter((d) => d.city.trim() !== "");

  if (validDestinations.length === 0) return null;

  // Calculate nights for each city based on date intervals
  const getNightsForCity = (index: number) => {
    if (index < validDestinations.length - 1) {
      const current = new Date(validDestinations[index].date);
      const next = new Date(validDestinations[index + 1].date);
      const diffTime = Math.abs(next.getTime() - current.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 3; // Default 3 nights for the last or single city
  };

  // Compile calculations for each destination
  const insightsData = validDestinations.map((dest, index) => {
    const nights = getNightsForCity(index);

    // Find matching hotels from API results to estimate average nightly price
    const cityHotels = hotels.filter(
      (h) => h.city?.toLowerCase() === dest.city.trim().toLowerCase()
    );
    const avgPrice =
      cityHotels.length > 0
        ? cityHotels.reduce((sum, h) => sum + h.price, 0) / cityHotels.length
        : 220; // Default fallback lodging price

    const lodgingCost = Math.round(avgPrice * nights);

    // Compute travel distance
    let distance = 0;
    let legName = "";

    if (index === 0) {
      if (validDestinations.length === 1) {
        // Single destination mock flight from home
        distance = dest.lat && dest.lng ? 1200 : 1500;
        legName = `Home ➔ ${dest.city}`;
      } else {
        distance = 0;
        legName = `Start: ${dest.city}`;
      }
    } else {
      const prev = validDestinations[index - 1];
      if (dest.lat && dest.lng && prev.lat && prev.lng) {
        distance = getHaversineDistance(prev.lat, prev.lng, dest.lat, dest.lng);
      } else {
        // Mock distance if coordinates aren't fully resolved yet
        distance = Math.round(800 + Math.abs(Math.sin(index) * 1200));
      }
      legName = `${prev.city} ➔ ${dest.city}`;
    }

    // Transit Cost ($0.12/km + base fee)
    const transitCost = distance > 0 ? Math.round(distance * 0.12 + 95) : 150;

    // Activities & dining cost ($95 per night)
    const activitiesCost = nights * 95;

    return {
      city: dest.city,
      nights,
      lodgingCost,
      transitCost,
      activitiesCost,
      totalCost: lodgingCost + transitCost + activitiesCost,
      distance,
      legName,
    };
  });

  // Calculate aggregated stats
  const totalCost = insightsData.reduce((sum, d) => sum + d.totalCost, 0);
  const totalDistance = insightsData.reduce((sum, d) => sum + d.distance, 0);
  const totalNights = insightsData.reduce((sum, d) => sum + d.nights, 0);

  const totalLodging = insightsData.reduce((sum, d) => sum + d.lodgingCost, 0);
  const totalTransit = insightsData.reduce((sum, d) => sum + d.transitCost, 0);
  const totalActivities = insightsData.reduce((sum, d) => sum + d.activitiesCost, 0);

  const avgLodgingPrice = Math.round(totalLodging / (totalNights || 1));

  // Pie chart budget distribution
  const pieData = [
    { name: "Hotels", value: totalLodging, color: "#0A1128" }, // Deep Navy
    { name: "Transport", value: totalTransit, color: "#FF5A5F" }, // Coral
    { name: "Food", value: totalActivities, color: "#F59E0B" }, // Warm Amber
  ];

  // Distance bar chart data (distance between stops)
  const distanceBarData = insightsData
    .filter((d) => d.distance > 0 || validDestinations.length === 1)
    .map((d) => ({
      leg: d.legName,
      distance: d.distance,
    }));

  // Render a loading state during server-side render to prevent hydration mismatches
  if (!mounted) {
    return (
      <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 h-[350px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-coral"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">Trip Insights Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Data visualization of estimated expenses and routing details for your journey.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-[13px] font-medium text-gray-600">
          <span>📅 Duration:</span>
          <span className="font-semibold text-gray-800">{totalNights} Nights</span>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">
            Total Estimated Cost
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-medium text-gray-900">${totalCost.toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-medium">USD</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">Includes lodging, transit & activities.</p>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">
            Total Travel Distance
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-medium text-gray-900">{totalDistance.toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-medium">km</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">Calculated using coordinates routing.</p>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">
            Avg. Lodging / Night
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-medium text-gray-900">${avgLodgingPrice}</span>
            <span className="text-xs text-gray-500 font-medium">/ night</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">Averaged across selected city accommodations.</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Allocation Pie Chart */}
        <div className="border border-gray-100 p-5 md:p-6 rounded-2xl flex flex-col h-[350px]">
          <h3 className="text-base font-medium text-gray-800 mb-4">Estimated Cost Breakdown</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-full md:w-1/2 h-[200px] text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`$${value}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-3 justify-center">
              {pieData.map((item, idx) => {
                const percentage = totalCost > 0 ? Math.round((item.value / totalCost) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-gray-600 font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">${item.value.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1.5">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Travel Distance Bar Chart */}
        <div className="border border-gray-100 p-5 md:p-6 rounded-2xl flex flex-col h-[350px]">
          <h3 className="text-base font-medium text-gray-800 mb-4">Travel Distances Between Stops</h3>
          <div className="w-full h-[260px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distanceBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis dataKey="leg" stroke="#9CA3AF" tickLine={false} />
                <YAxis stroke="#9CA3AF" tickLine={false} unit=" km" />
                <Tooltip
                  formatter={(value: any) => [`${value} km`, "Distance"]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #F3F4F6", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                />
                <Bar dataKey="distance" name="Distance" fill="#FF5A5F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
