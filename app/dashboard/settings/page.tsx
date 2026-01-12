"use client";

import { useState } from "react";
// import { Settings as SettingsIcon } from "lucide-react";

import SettingsHeader from "./components/SettingsHeader";
import SettingsTabs from "./components/SettingsTabs";
import ProfileSettings from "./components/ProfileSettings";
import CompanySettings from "./components/CompanySettings";
import NotificationSettings from "./components/NotificationSettings";
import SecuritySettings from "./components/SecuritySettings";
import PreferencesSettings from "./components/PreferencesSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "company": return <CompanySettings />;
      case "notifications": return <NotificationSettings />;
      case "security": return <SecuritySettings />;
      case "preferences": return <PreferencesSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <SettingsHeader />
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50">
          <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}