"use client";

import Link from "next/link";
import { ArrowRight, Building2, CheckCircle, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
const [mounted, setMounted] = useState(false);

useEffect(() => {
setMounted(true);
}, []);

if (!mounted) return null;

return (
<div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white selection:bg-blue-500 selection:text-white relative overflow-hidden">

```
  {/* Background Elements/Grid - Abstracted from reference */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"></div>
  </div>

  {/* Navbar */}
  <nav className="fixed top-0 w-full z-50 bg-transparent border-b border-white/10 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-blue-300" />
        <span className="text-2xl font-bold tracking-tight">WebbHeads</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
        <a href="#pricing" className="hover:text-blue-300 transition-colors">Pricing</a>
        <Link href="/auth/login" className="hover:text-blue-300 transition-colors">Login</Link>
      </div>

      <div className="flex items-center gap-4">
         <Link
          href="/auth/signup"
          className="hidden md:flex bg-white text-blue-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
        >
          Get Started
        </Link>
      </div>
    </div>
  </nav>

  {/* Hero Section */}
  <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6">
    <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
      
      {/* Badge - Inspired by reference */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800/50 border border-blue-700/50 text-sm font-medium backdrop-blur-md animate-fade-in">
        <CheckCircle className="h-4 w-4 text-blue-300" />
        <span>Enterprise-Grade Real Estate CRM</span>
      </div>

      {/* Headline - Inspired by reference */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
        Build Stronger <br />
        <span className="bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
          Client Relationships.
        </span>
      </h1>

      {/* Subtext - Inspired by reference */}
      <p className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed font-light">
        Manage properties, track leads, and close deals faster with an all-in-one platform designed for modern real estate agencies.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link
          href="/auth/signup"
          className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          Start Free Trial
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
          Watch Demo
        </button>
      </div>
    </div>

    {/* Dashboard Preview - Inspired by reference */}
    <div className="mt-20 relative mx-auto max-w-6xl animate-fade-in-up">
      {/* Glow effect behind the dashboard */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur-2xl opacity-30 -z-10"></div>
      
      {/* The "Browser Window" container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/10">
        {/* Window Controls/Header */}
        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 text-center text-xs font-medium text-gray-400">
            dashboard.webbheads.com
          </div>
        </div>
        
        {/* Dashboard Content Placeholder */}
        <div className="aspect-[16/10] bg-gray-100 relative flex items-center justify-center">
           {/* Replace this with an actual image of your dashboard later */}
           <div className="absolute inset-0 bg-[url('/dashboard-placeholder.png')] bg-cover bg-center opacity-80"></div>
           
           {/* Fallback content if no image */}
           <div className="text-center space-y-4 relative z-10 p-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30">
                <LayoutDashboard className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Example Dashboard</h3>
              <p className="text-gray-500 font-medium">Your data, beautifully organized.</p>
           </div>
        </div>
      </div>
    </div>
  </section>

  {/* Trusted By Section */}
  <section className="py-12 border-t border-white/10 bg-blue-900/50 backdrop-blur-sm relative z-10">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="text-sm font-medium text-blue-200 mb-6 uppercase tracking-wider">Trusted by innovative agencies</p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
        {/* Placeholders for client logos */}
        <div className="h-8 w-24 bg-white/20 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-white/20 rounded animate-pulse"></div>
        <div className="h-8 w-28 bg-white/20 rounded animate-pulse"></div>
        <div className="h-8 w-36 bg-white/20 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-white/20 rounded animate-pulse"></div>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="bg-blue-950 py-12 border-t border-white/10 relative z-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-blue-300/70">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-blue-300" />
        <span className="font-bold text-white text-lg">WebbHeads</span>
      </div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Contact Us</a>
      </div>
      <p>© 2026 WebbHeads CRM. All rights reserved.</p>
    </div>
  </footer>
</div>
);
}