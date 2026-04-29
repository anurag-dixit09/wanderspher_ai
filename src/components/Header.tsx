import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold tracking-tight text-navy">
          Wandersphere
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="#" className="hover:text-navy transition-colors">
          Discover
        </Link>
        <div className="relative">
          <Link href="#" className="text-navy font-semibold transition-colors">
            My Journeys
          </Link>
          {/* Active indicator */}
          <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-coral rounded-full"></div>
        </div>
        <Link href="#" className="hover:text-navy transition-colors">
          Concierge
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-navy transition-colors">
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-coral text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
