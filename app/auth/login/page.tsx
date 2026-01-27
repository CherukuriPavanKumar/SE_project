"use client";

// FIX 1: Import useFormState from react-dom
import { useFormState } from "react-dom";
import Link from "next/link";
import { login } from "@/app/auth/actions";
// FIX 2: Import the separated SubmitButton
import { LoginButton } from "../components/LoginButton"; 
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

const initialState = {
  error: "",
};

export default function LoginPage() {
  // FIX 3: useFormState returns [state, action]. It does NOT return isPending.
  const [state, formAction] = useFormState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-slate-900">
      
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden md:block">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[80px] opacity-60"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">WebbHeads</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Welcome back</h1>
        </div>

        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-6 md:p-10">
          
          {/* Server Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@agency.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* FIX 4: Use the separate button component which handles pending state */}
            <LoginButton text="Sign In" />
          </form>

          <div className="mt-8 text-center text-sm">
             <p className="text-slate-600">
              New to WebbHeads?{" "}
              <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}