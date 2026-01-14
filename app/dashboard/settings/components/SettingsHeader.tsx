import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="h-12 w-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-md border border-white/20">
        <Settings className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">
          Manage your account and application preferences
        </p>
      </div>
    </div>
  );
}