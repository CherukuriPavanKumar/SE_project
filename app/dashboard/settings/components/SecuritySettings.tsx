import { Shield, Clock, Lock } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectSecuritySettings, updateSecuritySettings } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function SecuritySettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSecuritySettings);

  const handleToggle = (key: "twoFactorAuth" | "loginAlerts") => {
    dispatch(updateSecuritySettings({ [key]: !settings[key] }));
    toast.success(`${key === "twoFactorAuth" ? "2FA" : "Login Alerts"} updated`);
  };

  const selectClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer";

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-1">
          Protect your account and manage access
        </p>
      </div>

      <div className="space-y-6">
        {/* 2FA Card */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="p-2 bg-white rounded-lg h-fit text-indigo-600 shadow-sm"><Shield className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-indigo-700 mt-1">Require a code in addition to your password.</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle("twoFactorAuth")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-indigo-600' : 'bg-indigo-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex gap-4">
            <div className="p-2 bg-gray-50 rounded-lg h-fit text-gray-600"><Lock className="h-5 w-5" /></div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Password</h3>
              <p className="text-sm text-gray-500 mt-1">Last changed: {settings.passwordLastChanged}</p>
              <button className="mt-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex gap-4 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg h-fit text-gray-600"><Clock className="h-5 w-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Session Timeout</h3>
              <p className="text-sm text-gray-500 mt-1">Auto-logout after inactivity</p>
            </div>
          </div>
          <select 
            value={settings.sessionTimeout}
            onChange={(e) => dispatch(updateSecuritySettings({ sessionTimeout: Number(e.target.value) }))}
            className={selectClasses}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}