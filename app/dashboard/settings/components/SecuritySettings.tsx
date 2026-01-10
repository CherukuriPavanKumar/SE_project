import { Shield, Key, Clock, AlertCircle, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectSecuritySettings, updateSecuritySettings } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function SecuritySettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSecuritySettings);

  const handleToggle = (key: "twoFactorAuth" | "loginAlerts") => {
    dispatch(updateSecuritySettings({ [key]: !settings[key] }));
    toast.success(`${key === "twoFactorAuth" ? "Two-Factor Authentication" : "Login Alerts"} ${!settings[key] ? "enabled" : "disabled"}!`);
  };

  const handleSessionTimeoutChange = (value: number) => {
    dispatch(updateSecuritySettings({ sessionTimeout: value }));
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account security and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">Two-Factor Authentication</h3>
              <p className="text-sm text-blue-700 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => handleToggle("twoFactorAuth")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Login Alerts</h3>
              <p className="text-sm text-gray-500 mt-1">
                Get notified when your account is accessed from a new device
              </p>
            </div>
            <button
              onClick={() => handleToggle("loginAlerts")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.loginAlerts ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.loginAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Session Timeout</h3>
              <p className="text-sm text-gray-500 mt-1">
                Automatically log out after a period of inactivity
              </p>
            </div>
          </div>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => handleSessionTimeoutChange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
          </select>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Password</h3>
              <p className="text-sm text-gray-500 mt-1">
                Last changed on {settings.passwordLastChanged}
              </p>
              <button
                onClick={() => toast("Change password feature coming soon")}
                className="mt-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={() => toast.success("Security settings saved successfully!")}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
