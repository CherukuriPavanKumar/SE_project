"use client";

import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

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
      case "profile":
        return <ProfileSettings />;
      case "company":
        return <CompanySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "preferences":
        return <PreferencesSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader />
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
