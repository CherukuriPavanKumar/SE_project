import { Save, Mail, MessageSquare, Smartphone, BellRing, type LucideIcon } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectNotificationSettings, updateNotificationSettings } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function NotificationSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectNotificationSettings);

  const handleToggle = (key: keyof typeof settings) => {
    dispatch(updateNotificationSettings({ [key]: !settings[key] }));
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Control how and when you receive alerts
        </p>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Channel Settings */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <BellRing className="h-4 w-4" /> Communication Channels
          </h3>
          <div className="space-y-1 divide-y divide-blue-100/50">
            <ToggleItem 
              label="Email Notifications" 
              desc="Receive important updates and digests via email" 
              icon={Mail}
              checked={settings.emailNotifications} 
              onChange={() => handleToggle("emailNotifications")} 
            />
            <ToggleItem 
              label="SMS Notifications" 
              desc="Receive urgent alerts via text message" 
              icon={Smartphone}
              checked={settings.smsNotifications} 
              onChange={() => handleToggle("smsNotifications")} 
            />
            <ToggleItem 
              label="Push Notifications" 
              desc="Browser notifications for real-time updates" 
              icon={BellRing}
              checked={settings.pushNotifications} 
              onChange={() => handleToggle("pushNotifications")} 
            />
          </div>
        </div>

        {/* Activity Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" /> Activity Alerts
          </h3>
          <div className="space-y-1 divide-y divide-gray-50">
            <ToggleItem 
              label="Lead Assignments" 
              desc="When a new lead is assigned to you" 
              checked={settings.leadAssignmentNotification} 
              onChange={() => handleToggle("leadAssignmentNotification")} 
            />
            <ToggleItem 
              label="Deal Updates" 
              desc="Status changes for deals you follow" 
              checked={settings.dealUpdateNotification} 
              onChange={() => handleToggle("dealUpdateNotification")} 
            />
            <ToggleItem 
              label="Site Visit Reminders" 
              desc="1 hour before scheduled visits" 
              checked={settings.siteVisitReminderNotification} 
              onChange={() => handleToggle("siteVisitReminderNotification")} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-4">
        <button onClick={() => toast.success("Settings saved")} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ 
  label, 
  desc, 
  checked, 
  onChange,
  icon: Icon
}: { 
  label: string, 
  desc: string, 
  checked: boolean, 
  onChange: () => void,
  icon?: LucideIcon
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
      <div className="flex items-start gap-3">
        {Icon && <div className="mt-0.5 p-1.5 bg-white rounded-md border border-gray-100 shadow-sm text-gray-500 hidden sm:block"><Icon className="h-4 w-4"/></div>}
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}