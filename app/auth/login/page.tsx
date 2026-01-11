"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Please enter your credentials");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: `user_${Date.now()}`,
        email: formData.email,
        tenantId: `tenant_${formData.email.split("@")[0]}`,
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("auth-user", JSON.stringify(mockUser));
      localStorage.setItem("auth-token", `mock-token-${mockUser.id}`);

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      // Fix: Log the error so the variable is 'used'
      console.error("Login error:", error); 
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[80px] opacity-60"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              WebbHeads
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@agency.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or continue with</span>
            </div>
          </div>

          {/* Social / Sign Up */}
          <div className="text-center">
             <p className="text-slate-600">
              Do not have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-8 mx-auto max-w-sm">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
             <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
             <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900">Demo Account</p>
                <div className="text-xs text-blue-700 font-mono flex flex-col gap-1">
                   <span>Email: demo@agency.com</span>
                   <span>Pass: demo123</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}