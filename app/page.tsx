"use client";

import Link from "next/link";
import { ArrowRight, Building2, CheckCircle, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white selection:bg-blue-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-blue-900/10 border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 md:h-8 md:w-8 text-blue-300" />
            <span className="text-xl md:text-2xl font-bold tracking-tight">WebbHeads</span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-300 transition-colors">Pricing</a>
            <Link href="/auth/login" className="hover:text-blue-300 transition-colors">Login</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
             <Link
              href="/auth/signup"
              className="bg-white text-blue-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-blue-900/95 backdrop-blur-xl border-b border-white/10 p-6 animate-in slide-in-from-top-5 fade-in duration-200 shadow-2xl">
            <div className="flex flex-col space-y-4">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-blue-100 hover:text-white py-2">Features</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-blue-100 hover:text-white py-2">Pricing</a>
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-blue-100 hover:text-white py-2">Login</Link>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center bg-white text-blue-900 px-6 py-3 rounded-xl text-base font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-800/50 border border-blue-700/50 text-xs md:text-sm font-medium backdrop-blur-md animate-fade-in">
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-blue-300" />
            <span>Enterprise-Grade Real Estate CRM</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Build Stronger <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              Client Relationships.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-light">
            Manage properties, track leads, and close deals faster with an all-in-one platform designed for modern real estate agencies.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 md:pt-6 px-4 sm:px-0">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group active:scale-95"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all active:scale-95">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 md:mt-20 relative mx-auto max-w-6xl animate-fade-in-up px-2 sm:px-0">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[1.5rem] md:rounded-[2rem] blur-xl md:blur-2xl opacity-30 -z-10"></div>
          
          <div className="relative bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/10">
            {/* Window Controls */}
            <div className="h-8 md:h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center text-[10px] md:text-xs font-medium text-gray-400 truncate px-4">
                dashboard.webbheads.com
              </div>
            </div>
            
            {/* Content Placeholder */}
            <div className="aspect-[16/10] bg-gray-100 relative flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('/dashboard-placeholder.png')] bg-cover bg-center opacity-80"></div>
               
               <div className="text-center space-y-4 relative z-10 p-6 md:p-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mx-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <LayoutDashboard className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Example Dashboard</h3>
                    <p className="text-sm md:text-base text-gray-500 font-medium">Your data, beautifully organized.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-t border-white/10 bg-blue-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs md:text-sm font-medium text-blue-200 mb-8 uppercase tracking-wider">Trusted by innovative agencies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {/* Responsive Placeholders */}
            <div className="h-6 w-20 md:h-8 md:w-24 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-28 md:h-8 md:w-32 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-24 md:h-8 md:w-28 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-32 md:h-8 md:w-36 bg-white/20 rounded animate-pulse"></div>
            <div className="h-6 w-20 md:h-8 md:w-24 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 py-12 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-blue-300/70">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-300" />
            <span className="font-bold text-white text-lg">WebbHeads</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-center md:text-right">© 2026 WebbHeads CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}