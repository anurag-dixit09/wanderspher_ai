import Link from "next/link";
import React from "react";

export default function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-xl font-bold tracking-tight text-navy">
        Wandersphere
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="#" className="text-sm font-medium text-gray-700 hover:text-navy transition-colors">
          Need help?
        </Link>
      </div>
    </header>
  );
}
