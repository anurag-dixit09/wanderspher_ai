import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";
import React from "react";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[url('/sunset-bg.png')] bg-cover bg-center bg-no-repeat">
      {/* Optional overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-24">
        {/* Glassmorphic Card */}
        <div className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-navy mb-1.5">Join Wandersphere</h1>
            <p className="text-sm text-gray-600">Start your journey with us today.</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/80 border border-white/50 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/80 border border-white/50 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-white/80 border border-white/50 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-white/80 border border-white/50 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-start mt-2">
              <input type="checkbox" id="terms" className="mt-0.5 h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded cursor-pointer" />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-700 leading-tight">
                I agree to the <Link href="#" className="font-semibold hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold hover:underline">Privacy Policy</Link>.
              </label>
            </div>
            
            <button type="button" className="w-full bg-coral hover:bg-opacity-90 text-white font-medium py-3 rounded-xl shadow-lg shadow-coral/30 mt-2 transition-all">
              Create Account
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-navy hover:underline">
              Login
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                <span className="px-3 bg-transparent">or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 w-full py-2 bg-white/70 hover:bg-white/90 border border-white/50 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm">
                <span className="font-bold text-base">G</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 bg-white/70 hover:bg-white/90 border border-white/50 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm">
                <span className="font-bold text-base"></span> Apple
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
