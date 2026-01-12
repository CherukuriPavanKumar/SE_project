import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-sm">
        <Settings className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and application preferences
        </p>
      </div>
    </div>
  );
}