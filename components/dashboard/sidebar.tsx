"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signout } from "@/app/auth/actions"; // Import the Server Action
import {
  LayoutDashboard,
  Users,
  Home,
  Calendar,
  TrendingUp,
  UserCheck,
  FileText,
  BarChart3,
  Settings,
  Building2,
  LogOut,
  UserCog,
  Headphones,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Site Visits", href: "/dashboard/site-visits", icon: Calendar },
  { name: "Deals", href: "/dashboard/deals", icon: TrendingUp },
  { name: "Clients", href: "/dashboard/clients", icon: UserCheck },
  { name: "Agents", href: "/dashboard/agents", icon: UserCog },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Support", href: "/dashboard/support", icon: Headphones },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    // 1. User Feedback
    toast.success("Signing out...");
    
    // 2. Call Server Action (Clears cookies & Redirects)
    await signout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Area */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
              WebbHeads
            </span>
          </Link>
          <button 
            onClick={onClose} 
            className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
          {navigation.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon 
                  className={`h-5 w-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex-shrink-0">
          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}