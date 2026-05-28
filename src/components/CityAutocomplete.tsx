"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string, placeId?: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export default function CityAutocomplete({ value, onChange, placeholder }: CityAutocompleteProps) {
  const placesLib = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync prop value to local input value if changed externally
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || "");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize session token when places library is loaded
  useEffect(() => {
    if (placesLib && !sessionToken) {
      setSessionToken(new placesLib.AutocompleteSessionToken());
    }
  }, [placesLib, sessionToken]);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!placesLib || !inputValue || inputValue.trim() === "" || !sessionToken || !isOpen) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      // 1. Try modern Places API (New)
      try {
        if (placesLib.AutocompleteSuggestion) {
          const { suggestions: results } = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: inputValue,
            sessionToken,
            includedPrimaryTypes: ["(cities)"],
          });
          const mapped = (results || []).map((s: any) => ({
            isNewApi: true,
            raw: s,
            placeId: s.placePrediction?.placeId,
            mainText: s.placePrediction?.mainText?.text || s.placePrediction?.mainText || "",
            secondaryText: s.placePrediction?.secondaryText?.text || s.placePrediction?.secondaryText || "",
            description: s.placePrediction?.text || [s.placePrediction?.mainText?.text || "", s.placePrediction?.secondaryText?.text || ""].filter(Boolean).join(", "),
          }));
          setSuggestions(mapped);
          return;
        }
      } catch (err) {
        console.warn("Places API (New) suggestion fetch failed, trying legacy AutocompleteService:", err);
      }

      // 2. Fallback: Use Legacy AutocompleteService
      try {
        const autocompleteService = new placesLib.AutocompleteService();
        autocompleteService.getPlacePredictions(
          {
            input: inputValue,
            types: ["(cities)"],
            sessionToken,
          },
          (predictions: any, status: any) => {
            if (status === "OK" && predictions) {
              const mapped = predictions.map((p: any) => ({
                isNewApi: false,
                raw: p,
                placeId: p.place_id,
                mainText: p.structured_formatting?.main_text || "",
                secondaryText: p.structured_formatting?.secondary_text || "",
                description: p.description || "",
              }));
              setSuggestions(mapped);
            } else {
              setSuggestions([]);
            }
          }
        );
      } catch (fallbackErr) {
        console.error("Fallback AutocompleteService failed:", fallbackErr);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, placesLib, sessionToken, isOpen]);

  const handleSelect = async (suggestion: any) => {
    const description = suggestion.description;
    setInputValue(description);
    setSuggestions([]);
    setIsOpen(false);

    try {
      if (suggestion.isNewApi) {
        const place = suggestion.raw.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["id", "location"],
        });
        const lat = place.location?.lat();
        const lng = place.location?.lng();
        const placeId = place.id;
        onChange(description, placeId, lat, lng);
      } else {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ placeId: suggestion.placeId }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            onChange(description, suggestion.placeId, lat, lng);
          } else {
            onChange(description, suggestion.placeId);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      onChange(description, suggestion.placeId);
    }

    // Refresh session token for the next query session
    if (placesLib) {
      setSessionToken(new placesLib.AutocompleteSessionToken());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    onChange(val); // Report typing to parent
  };

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder || "Where to? (e.g. Tokyo, Paris)"}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all focus:bg-white disabled:opacity-50"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto text-left">
          {suggestions.map((suggestion) => {
            const placeId = suggestion.placeId;
            const mainText = suggestion.mainText;
            const secondaryText = suggestion.secondaryText;
            return (
              <li
                key={placeId}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-none transition-colors"
              >
                <span className="font-medium text-gray-900">{mainText}</span>
                <span className="text-xs text-gray-500">{secondaryText}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
