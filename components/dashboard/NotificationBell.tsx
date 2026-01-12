"use client";

import { Bell } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUnreadCount } from "@/lib/redux/slices/notificationSlice";
import toast from "react-hot-toast";

export default function NotificationBell() {
  // Connected to Redux for real-time updates
  const unreadCount = useAppSelector(selectUnreadCount);

  const handleClick = () => {
    // In a real app, this would open a dropdown or sidebar
    toast.success(`You have ${unreadCount} unread notifications`);
  };

  return (
    <button 
      onClick={handleClick}
      className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <>
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm transform scale-0 group-hover:scale-100 transition-transform origin-bottom-left">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </>
      )}
    </button>
  );
}