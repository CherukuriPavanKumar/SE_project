import { User, Building2, Bell, Shield, Palette, ChevronRight } from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal details" },
    { id: "company", label: "Company", icon: Building2, desc: "Business info" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert preferences" },
    { id: "security", label: "Security", icon: Shield, desc: "Password & 2FA" },
    { id: "preferences", label: "Preferences", icon: Palette, desc: "Theme & locale" },
  ];

  return (
    <nav className="flex flex-row lg:flex-col p-2 lg:p-3 gap-2 overflow-x-auto lg:overflow-visible no-scrollbar scroll-smooth">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center justify-between px-4 py-3 rounded-lg transition-all w-full text-left group relative
              min-w-[200px] lg:min-w-0 flex-shrink-0 lg:flex-shrink
              ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 z-10"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`} />
              
              <div className="flex-1 min-w-0">
                <span className={`block text-sm font-semibold truncate ${isActive ? "text-blue-900" : "text-gray-700"}`}>
                  {tab.label}
                </span>
                <span className={`block text-xs mt-0.5 truncate ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                  {tab.desc}
                </span>
              </div>
            </div>

            {isActive && (
              <ChevronRight className="h-4 w-4 text-blue-400 flex-shrink-0 ml-3" />
            )}
          </button>
        );
      })}
    </nav>
  );
}