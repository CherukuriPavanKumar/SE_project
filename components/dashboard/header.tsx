"use client";

import { Search } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUserProfile } from "@/lib/redux/slices/settingsSlice";
import NotificationBell from "./NotificationBell"; // Imported the modular component

export default function Header() {
  const userProfile = useAppSelector(selectUserProfile);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads, properties, clients..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Module */}
        <NotificationBell />

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">{userProfile.name}</p>
            <p className="text-xs text-gray-500 mt-1 leading-none">{userProfile.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white cursor-pointer hover:shadow-lg transition-shadow">
            {getInitials(userProfile.name)}
          </div>
        </div>
      </div>
    </header>
  );
}