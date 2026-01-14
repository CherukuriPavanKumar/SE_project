"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Filter, ChevronDown, Check, type LucideIcon } from "lucide-react";
import { leadSources, leadStages } from "@/lib/constants";

interface LeadFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStage: string;
  setSelectedStage: (value: string) => void;
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  selectedAgentRole: string;
  setSelectedAgentRole: (value: string) => void;
}

// Reusable Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  icon?: LucideIcon; // Fixed: Use LucideIcon type instead of any
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm flex items-center justify-between hover:border-gray-300"
      >
        <span className="truncate">{value}</span>
        {Icon ? (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 min-w-[150px]">
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
                <span className="truncate">{option}</span>
                {value === option && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadFilters({
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  selectedSource,
  setSelectedSource,
  selectedAgentRole,
  setSelectedAgentRole,
}: LeadFiltersProps) {
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Search Bar */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Name, Phone, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 placeholder:text-gray-400 transition-all shadow-sm"
          />
        </div>

        {/* Custom Dropdowns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <CustomDropdown
            value={selectedStage}
            onChange={setSelectedStage}
            options={leadStages}
            icon={Filter}
          />

          <CustomDropdown
            value={selectedSource}
            onChange={setSelectedSource}
            options={leadSources}
          />

          <CustomDropdown
            value={selectedAgentRole}
            onChange={setSelectedAgentRole}
            options={["All Agents", "Employee", "Broker"]}
          />
          
        </div>
      </div>
    </div>
  );
}