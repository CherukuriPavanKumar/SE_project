import { Save, Mail, MessageSquare } from "lucide-react";
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
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">
          Control how and when you receive alerts
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4" /> General Channels
          </h3>
          <div className="space-y-4">
            <ToggleItem 
              label="Email Notifications" 
              desc="Receive important updates via email" 
              checked={settings.emailNotifications} 
              onChange={() => handleToggle("emailNotifications")} 
            />
            <ToggleItem 
              label="SMS Notifications" 
              desc="Receive urgent alerts via text message" 
              checked={settings.smsNotifications} 
              onChange={() => handleToggle("smsNotifications")} 
            />
            <ToggleItem 
              label="Push Notifications" 
              desc="Browser notifications for real-time updates" 
              checked={settings.pushNotifications} 
              onChange={() => handleToggle("pushNotifications")} 
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Activity Alerts
          </h3>
          <div className="space-y-4">
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

      <div className="flex justify-end pt-6">
        <button onClick={() => toast.success("Settings saved")} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}