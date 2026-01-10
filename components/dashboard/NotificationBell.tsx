"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const [notificationCount] = useState(3);

  return (
    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group">
      <Bell className="h-5 w-5" />
      {notificationCount > 0 && (
        <>
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {notificationCount}
          </span>
        </>
      )}
    </button>
  );
}
