import { Bell, Save } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { selectNotificationSettings, updateNotificationSettings } from "@/lib/redux/slices/settingsSlice";
import toast from "react-hot-toast";

export default function NotificationSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectNotificationSettings);

  const handleToggle = (key: keyof typeof settings) => {
    dispatch(updateNotificationSettings({ [key]: !settings[key] }));
  };

  const handleSave = () => {
    toast.success("Notification settings saved successfully!");
  };

  const notificationGroups = [
    {
      title: "General Notifications",
      items: [
        { key: "emailNotifications" as const, label: "Email Notifications", description: "Receive notifications via email" },
        { key: "smsNotifications" as const, label: "SMS Notifications", description: "Receive notifications via SMS" },
        { key: "pushNotifications" as const, label: "Push Notifications", description: "Receive browser push notifications" },
      ],
    },
    {
      title: "Activity Notifications",
      items: [
        { key: "leadAssignmentNotification" as const, label: "Lead Assignments", description: "Get notified when leads are assigned to you" },
        { key: "dealUpdateNotification" as const, label: "Deal Updates", description: "Get notified about deal status changes" },
        { key: "siteVisitReminderNotification" as const, label: "Site Visit Reminders", description: "Receive reminders for upcoming site visits" },
        { key: "documentUploadNotification" as const, label: "Document Uploads", description: "Get notified when documents are uploaded" },
      ],
    },
    {
      title: "Report Notifications",
      items: [
        { key: "weeklyReportEmail" as const, label: "Weekly Reports", description: "Receive weekly performance reports via email" },
        { key: "monthlyReportEmail" as const, label: "Monthly Reports", description: "Receive monthly performance reports via email" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="space-y-8">
        {notificationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{group.title}</h3>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-start justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-900">
                        {item.label}
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-6">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
}
