"use client";

import { useState } from "react";
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <SettingsHeader />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6 overflow-hidden">
            <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}