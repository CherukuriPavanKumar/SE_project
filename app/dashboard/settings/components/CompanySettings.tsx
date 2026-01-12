import { useState } from "react";
import { Building2, Mail, Phone, MapPin, Globe, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectCompanySettings, updateCompanySettings } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function CompanySettings() {
  const dispatch = useAppDispatch();
  const companySettings = useAppSelector(selectCompanySettings);
  
  const [formData, setFormData] = useState(companySettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateCompanySettings(formData));
    toast.success("Company settings updated successfully!");
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Company Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your company details and business information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className={`${inputClasses} pl-10`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" value={formData.companyEmail} onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })} className={`${inputClasses} pl-10`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="tel" value={formData.companyPhone} onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })} className={`${inputClasses} pl-10`} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={`${inputClasses} pl-10`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
            <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClasses} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
            <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputClasses} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
            <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputClasses} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
            <input type="text" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className={inputClasses} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className={`${inputClasses} pl-10`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax ID</label>
            <input type="text" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} className={inputClasses} />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}