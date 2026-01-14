"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, Mail, Lock, ArrowRight, Eye, EyeOff, 
  User, Globe, Phone, Users, ShieldCheck, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    agencyName: "",
    website: "",
    teamSize: "",
    licenseId: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const requiredFields = ['agencyName', 'fullName', 'email', 'phone', 'password', 'teamSize'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields marked with *");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser = {
        id: `user_${Date.now()}`,
        email: formData.email,
        fullName: formData.fullName,
        agencyName: formData.agencyName,
        tenantId: `tenant_${formData.agencyName.toLowerCase().replace(/\s+/g, "-")}`,
        role: "admin",
        createdAt: new Date().toISOString(),
        verification: {
          website: formData.website,
          phone: formData.phone,
          licenseId: formData.licenseId,
          teamSize: formData.teamSize
        }
      };

      localStorage.setItem("auth-user", JSON.stringify(mockUser));
      localStorage.setItem("auth-token", `mock-token-${mockUser.id}`);

      toast.success("Account created! Verification pending.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Elements - Hidden on mobile */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden md:block">
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[80px] opacity-70"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-[80px] opacity-70"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              WebbHeads
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Register Agency</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Create a business account to get started.</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section: Business Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agency Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Agency Name *</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. Prestige Realty"
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange("agencyName", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Website</label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="url"
                      placeholder="www.agency.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Team Size */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Team Size *</label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange("teamSize", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base appearance-none"
                      required
                    >
                      <option value="">Select size</option>
                      <option value="1-5">1-5 Agents</option>
                      <option value="6-20">6-20 Agents</option>
                      <option value="21-50">21-50 Agents</option>
                      <option value="50+">50+ Agents</option>
                    </select>
                  </div>
                </div>

                {/* License / RERA ID */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">License / RERA ID</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Optional verification"
                      value={formData.licenseId}
                      onChange={(e) => handleInputChange("licenseId", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Contact Person */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Contact Person</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Email (Full Width) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Work Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="name@agency.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="8+ characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm md:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-xs md:text-sm text-slate-500">
                I verify that this is a legitimate business and I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <>
                  Create Business Account <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 md:mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm md:text-base">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}