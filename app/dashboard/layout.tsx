"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-hidden">
      {/* Sidebar with state props */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header with toggle callback */}
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 lg:p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}