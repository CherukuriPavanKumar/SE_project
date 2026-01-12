"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
// import { useAppSelector } from "@/lib/redux/hooks";
// import { selectUserProfile } from "@/lib/redux/slices/settingsSlice";
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // const userProfile = useAppSelector(selectUserProfile);

  const handleSignOut = () => {
    // Add logic here to clear auth tokens/storage
    localStorage.removeItem("user"); 
    toast.success("Signed out successfully");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200 shadow-sm z-30">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">WebbHeads</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {navigation.map((item) => {
          // Robust active state detection
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
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
      <div className="border-t border-gray-100 p-4 bg-gray-50/50">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}