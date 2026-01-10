"use client";

import { Bell, Search } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserProfile } from "@/lib/redux/slices/settingsSlice";
import { selectUnreadCount } from "@/lib/redux/slices/notificationSlice";

export default function Header() {
  const userProfile = useAppSelector(selectUserProfile);
  const unreadCount = useAppSelector(selectUnreadCount);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads, properties, clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {unreadCount}
              </span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(userProfile.name)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
            <p className="text-xs text-gray-500">{userProfile.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
