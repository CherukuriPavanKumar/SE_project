import { Palette, Globe, DollarSign, Calendar, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectSettings, updateTheme, updateLanguage, updateCurrency, updateDateFormat } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

type ThemeType = "light" | "dark" | "system";

export default function PreferencesSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const selectClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none shadow-sm";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none";

  const handleSave = () => {
    toast.success("Preferences Saved");
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">App Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize your workspace experience
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Theme</label>
            <div className="relative">
              <Palette className={iconClasses} />
              <select 
                value={settings.theme} 
                onChange={(e) => dispatch(updateTheme(e.target.value as ThemeType))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Language</label>
            <div className="relative">
              <Globe className={iconClasses} />
              <select 
                value={settings.language} 
                onChange={(e) => dispatch(updateLanguage(e.target.value))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Currency</label>
            <div className="relative">
              <DollarSign className={iconClasses} />
              <select 
                value={settings.currency} 
                onChange={(e) => dispatch(updateCurrency(e.target.value))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Date Format</label>
            <div className="relative">
              <Calendar className={iconClasses} />
              <select 
                value={settings.dateFormat} 
                onChange={(e) => dispatch(updateDateFormat(e.target.value))} 
                className={`${selectClasses} pl-10`}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-4 border-t border-gray-100">
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}