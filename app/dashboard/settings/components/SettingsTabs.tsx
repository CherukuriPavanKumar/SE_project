import { User, Building2, Bell, Shield, Palette } from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    // Updated layout: Horizontal scroll on mobile, Vertical stack on desktop
    <nav className="flex flex-row md:flex-col p-2 gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all w-full text-left whitespace-nowrap
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
              }
            `}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}