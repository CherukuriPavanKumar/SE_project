import { Palette, Globe, DollarSign, Calendar, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectSettings, updateTheme, updateLanguage, updateCurrency, updateDateFormat } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

// Define the valid theme type
type ThemeType = "light" | "dark" | "system";

export default function PreferencesSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const selectClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none";

  const handleSave = () => {
    // In a real app, this might trigger an API call
    toast.success("Preferences Saved");
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">App Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize your workspace experience
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
          <div className="relative">
            <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select 
              value={settings.theme} 
              // Fixed: Cast to specific ThemeType instead of any
              onChange={(e) => dispatch(updateTheme(e.target.value as ThemeType))} 
              className={`${selectClasses} pl-10`}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select 
              value={settings.language} 
              onChange={(e) => dispatch(updateLanguage(e.target.value))} 
              className={`${selectClasses} pl-10`}
            >
              <option value="en">English (US)</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                value={settings.currency} 
                onChange={(e) => dispatch(updateCurrency(e.target.value))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                value={settings.dateFormat} 
                onChange={(e) => dispatch(updateDateFormat(e.target.value))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}