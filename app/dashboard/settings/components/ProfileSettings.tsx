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

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal details and contact information
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {userProfile.name.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{userProfile.role}</p>
          <p className="text-xs text-gray-400 mt-1">Member since {userProfile.joinedDate}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`${inputClasses} pl-10`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}