"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown, Check, type LucideIcon } from "lucide-react";
import { agentRoles, agentStatuses } from "@/lib/constants";

interface AgentFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

// Reusable Custom Dropdown
function CustomDropdown({
  value,
  onChange,
  options,
  icon: Icon,
  displayLabels,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  icon?: LucideIcon;
  displayLabels?: Record<string, string>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full" style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm flex items-center justify-between hover:border-gray-300"
      >
        <span className="truncate">{displayLabels ? (displayLabels[value] || value) : value}</span>
        {Icon ? (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                  ${value === option ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span className="truncate">{displayLabels ? (displayLabels[option] || option) : option}</span>
                {value === option && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentFilters({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}: AgentFiltersProps) {
  
  const roleLabels: Record<string, string> = {
    "All Roles": "All Roles",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 placeholder:text-gray-400 transition-all shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CustomDropdown
            value={selectedRole}
            onChange={setSelectedRole}
            options={["All Roles", ...agentRoles]}
            icon={Filter}
            displayLabels={roleLabels}
          />
          <CustomDropdown
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={["All Status", ...agentStatuses]}
          />
        </div>
      </div>
    </div>
  );
}