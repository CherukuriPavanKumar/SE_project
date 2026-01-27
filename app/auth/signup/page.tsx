"use client";

// 1. CHANGE THIS IMPORT
import { useFormState } from "react-dom"; // Changed from useActionState
import { useState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "../components/SubmitButton"; // We will create this below
import { Building2, Mail, Lock, User, Phone, Users, Eye, EyeOff, AlertCircle } from "lucide-react";

// 2. DEFINE INITIAL STATE
const initialState = {
  error: "",
};

export default function SignupPage() {
  // 3. USE useFormState INSTEAD
  // Note: useFormState does NOT return isPending. We must use a separate component for the button.
  const [state, formAction] = useFormState(signup, initialState);

  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit = (formData: FormData) => {
    if (pass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }
    formAction(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-white text-slate-900">
      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
             <div className="p-2.5 bg-blue-600 rounded-lg text-white"><Building2 className="h-6 w-6" /></div>
             <span className="text-2xl font-bold text-slate-900">WebbHeads</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Register Agency</h1>
        </div>

        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8">
          
          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            
            {/* Business Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Agency Name *</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input name="agencyName" type="text" placeholder="e.g. Prestige Realty" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Team Size *</label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select name="teamSize" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all appearance-none" required>
                      <option value="1-5">1-5 Agents</option>
                      <option value="6-20">6-20 Agents</option>
                      <option value="21-50">21-50 Agents</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input name="fullName" type="text" placeholder="John Doe" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input name="phone" type="tel" placeholder="+91 98765 43210" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Work Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input name="email" type="email" placeholder="name@agency.com" className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" 
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="password" 
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:border-blue-600 outline-none transition-all" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. USE THE SEPARATE COMPONENT FOR LOADING STATE */}
            <SubmitButton />

          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500">Already have an account? <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}