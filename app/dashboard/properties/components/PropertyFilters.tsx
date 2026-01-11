import { Search, Filter } from "lucide-react";
import { propertyTypes, propertyStatuses } from "@/lib/constants";

interface PropertyFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedAgentRole: string;
  setSelectedAgentRole: (value: string) => void;
}

export default function PropertyFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedAgentRole,
  setSelectedAgentRole,
}: PropertyFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search - Wider */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Title, Location, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-7 flex flex-col sm:flex-row gap-3">
          {/* Type Filter */}
          <div className="relative w-full">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative w-full">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {propertyStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Agent Role Filter */}
          <div className="relative w-full">
            <select
              value={selectedAgentRole}
              onChange={(e) => setSelectedAgentRole(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="All Agents">All Listed By</option>
              <option value="Employee">Employees</option>
              <option value="Broker">Brokers</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}