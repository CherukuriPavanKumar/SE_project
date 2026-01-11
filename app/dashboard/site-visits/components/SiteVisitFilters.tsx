import { Search, Filter } from "lucide-react";
import { visitStatuses, agentRoles } from "@/lib/constants";

interface SiteVisitFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedAgentRole: string;
  setSelectedAgentRole: (value: string) => void;
}

export default function SiteVisitFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedAgentRole,
  setSelectedAgentRole,
}: SiteVisitFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Lead, Property, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-6 flex flex-col sm:flex-row gap-3">
          <div className="relative w-full">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {visitStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-full">
            <select
              value={selectedAgentRole}
              onChange={(e) => setSelectedAgentRole(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {agentRoles.map((role) => (
                <option key={role} value={role}>{role === "All" ? "All Roles" : role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}