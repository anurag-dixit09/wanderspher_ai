import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[url('/sunset-bg.png')] bg-cover bg-center bg-no-repeat">
      {/* Optional overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <AuthHeader />
      
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-24">
        {/* Glassmorphic Card */}
        <div className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold text-navy mb-1">Welcome back</h1>
          </div>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-white/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="#" className="text-sm font-medium text-coral hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white/80 border border-white/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            
            <button type="button" className="w-full bg-coral hover:bg-opacity-90 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-coral/30 flex justify-center items-center gap-2 transition-all">
              Login <span className="text-lg leading-none">→</span>
            </button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/40"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-gray-500 font-medium">or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/70 hover:bg-white/90 border border-white/50 rounded-xl text-sm font-medium text-gray-700 transition-colors shadow-sm">
                <span className="font-bold text-lg">G</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/70 hover:bg-white/90 border border-white/50 rounded-xl text-sm font-medium text-gray-700 transition-colors shadow-sm">
                <span className="font-bold text-lg"></span> Apple
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-coral hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
