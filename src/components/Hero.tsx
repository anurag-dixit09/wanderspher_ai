"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getHotels, Hotel } from "@/services/travelApi";
import Itinerary, { Destination } from "./Itinerary";
import { APIProvider } from "@vis.gl/react-google-maps";
import CityAutocomplete from "./CityAutocomplete";
import TripInsights from "./TripInsights";

// SVG check icon
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// SVG star icon
const StarIcon = () => (
  <svg className="w-[14px] h-[14px] text-coral mr-1.5 mb-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function Hero() {
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [destinations, setDestinations] = useState<Destination[]>([{ id: 1, city: "", date: new Date() }]);
  const [submittedDestinations, setSubmittedDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  const fetchCityImage = async (city: string) => {
    if (!city || !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) return;
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " city landmark")}&orientation=landscape&per_page=1&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setHeroImage(data.results[0].urls.regular);
      }
    } catch (err) {
      console.error("Failed to fetch image", err);
    }
  };

  const fetchTravelData = async (locations: { city: string, lat?: number, lng?: number }[]) => {
    setIsLoading(true);
    try {
      const data = await getHotels(locations);
      setHotels(data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTravelData([]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDestinations([...destinations]);
    const validDestinations = destinations.filter(d => d.city.trim() !== "");
    fetchTravelData(validDestinations);
  };

  const toggleMode = (newMode: "single" | "multi") => {
    setMode(newMode);
    if (newMode === "single") {
      setDestinations(prev => [prev[0]]);
    }
  };

  const addDestination = () => {
    setDestinations(prev => [...prev, { id: Date.now(), city: "", date: new Date() }]);
  };

  const removeDestination = (id: number) => {
    if (destinations.length > 1) {
      setDestinations(prev => prev.filter(d => d.id !== id));
    }
  };

  const updateDestination = (id: number, field: "city" | "date", value: any) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const updateCityData = (id: number, city: string, placeId?: string, lat?: number, lng?: number) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, city, placeId, lat, lng } : d));
    if (placeId) {
      fetchCityImage(city);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <section
        className="flex flex-col items-center w-full px-8 py-16 max-w-[1200px] mx-auto transition-all duration-1000"
        style={heroImage ? {
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.98)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '32px',
          marginTop: '16px'
        } : {}}
      >
        {/* Search Header */}
        <div className="w-full mb-8 pl-1 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h1 className="text-[26px] font-normal text-gray-800 mb-2">
              Compare Your Top Picks
            </h1>
            <p className="text-gray-600 max-w-2xl text-[15px] leading-relaxed">
              Refining your journey from premium luxury to authentic local stays. Review side-by-side details to finalize your experience.
            </p>
          </div>
        </div>

        {/* Interactive Search Box */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
          {/* Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-full w-fit mb-6">
            <button
              type="button"
              onClick={() => toggleMode("single")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "single" ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Single Destination
            </button>
            <button
              type="button"
              onClick={() => toggleMode("multi")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "multi" ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Multi-City Trip
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="space-y-3">
              {destinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className="flex items-center gap-3 transition-all duration-300 ease-in-out transform origin-top"
                  style={{ opacity: 1, maxHeight: '100px' }}
                >
                  {/* City Input */}
                  <CityAutocomplete
                    value={dest.city}
                    onChange={(city, placeId, lat, lng) => updateCityData(dest.id, city, placeId, lat, lng)}
                  />

                  {/* Date Picker */}
                  <div className="relative w-48">
                    <DatePicker
                      selected={dest.date}
                      onChange={(date: Date | null) => date && updateDestination(dest.id, "date", date)}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all focus:bg-white"
                      dateFormat="MMM d, yyyy"
                    />
                  </div>

                  {/* Remove Button (only show if multi mode and more than 1 row) */}
                  {mode === "multi" && destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(dest.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
              <div>
                {mode === "multi" && (
                  <button
                    type="button"
                    onClick={addDestination}
                    className="flex items-center gap-2 text-coral font-medium hover:text-coral/80 transition-colors px-2 py-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Destination
                  </button>
                )}
              </div>
              <button type="submit" className="bg-navy hover:bg-navy-dark text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Itinerary Timeline */}
        {mode === "multi" && submittedDestinations.length > 0 && !isLoading && (
          <Itinerary destinations={submittedDestinations} />
        )}

        {/* Loading State or Cards Grid */}
        {isLoading ? (
          <div className="w-full py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="relative bg-white rounded-2xl overflow-hidden border-2 border-coral/80 shadow-md flex flex-col">
                {/* Image Container */}
                <div className="relative w-full h-[220px]">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />

                  {/* Optional Tag (BEST VALUE) */}
                  {hotel.tag && (
                    <div className="absolute top-4 left-4 bg-coral text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full z-10">
                      {hotel.tag}
                    </div>
                  )}

                  {/* Selected Checkbox Icon */}
                  <div className="absolute top-4 right-4 bg-coral text-white w-[26px] h-[26px] rounded-md flex items-center justify-center shadow-sm z-10">
                    <CheckIcon />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[17px] font-normal text-gray-900">{hotel.name}</h3>
                    {hotel.city && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {hotel.city}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <StarIcon />
                    <span className="font-medium text-gray-800 mr-1">{hotel.rating}</span>
                    <span>({hotel.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium tracking-wider mb-1 uppercase">Per Night</p>
                      <p className="text-xl font-normal text-gray-900">${hotel.price}</p>
                    </div>
                    <a href="#" className="text-coral font-medium text-[15px] flex items-center gap-1.5 group">
                      View Details <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trip Insights Dashboard */}
        {!isLoading && (
          <TripInsights
            destinations={
              submittedDestinations.length > 0
                ? submittedDestinations
                : [{ id: 1, city: "Paris", lat: 48.8566, lng: 2.3522, date: new Date() }]
            }
            hotels={hotels}
          />
        )}
      </section>
    </APIProvider>
  );
}
