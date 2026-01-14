import { useState } from "react";
import { User, Mail, Phone, Building2, Save, Camera } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectUserProfile, updateUserProfile } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function ProfileSettings() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    department: userProfile.department,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
    toast.success("Profile updated successfully!");
  };

  // Added pr-10 to prevent text overlapping with potential browser extension icons
  const inputClasses = "w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400 appearance-none";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none";

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal details and contact information
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
            {userProfile.name.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{userProfile.role}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
              Member since {userProfile.joinedDate}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative group">
              <User className={iconClasses} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative group">
              <Mail className={iconClasses} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClasses}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
            <div className="relative group">
              <Phone className={iconClasses} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Department</label>
            <div className="relative group">
              <Building2 className={iconClasses} />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={inputClasses}
                autoComplete="organization-title"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}