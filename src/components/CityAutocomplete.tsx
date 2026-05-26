"use client";

import React, { useEffect, useRef, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string, placeId?: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export default function CityAutocomplete({ value, onChange, placeholder }: CityAutocompleteProps) {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
    debounce: 300,
  });

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync prop value to local input value if changed externally
  useEffect(() => {
    if (value !== inputValue) {
      setValue(value, false);
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

  const handleSelect = async (suggestion: any) => {
    const { description, place_id } = suggestion;
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onChange(description, place_id, lat, lng);
    } catch (error) {
      console.error("Error fetching geocode:", error);
      // Fallback to just the text
      onChange(description);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsOpen(true);
    onChange(e.target.value); // Report typing to parent
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
      {isOpen && status === "OK" && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto text-left">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;
            return (
              <li
                key={place_id}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-none transition-colors"
              >
                <span className="font-medium text-gray-900">{main_text}</span>
                <span className="text-xs text-gray-500">{secondary_text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
