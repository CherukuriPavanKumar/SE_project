import { Search } from "lucide-react";
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search visits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {visitStatuses.map((status) => (
            <option key={status} value={status} className="text-gray-900">
              {status}
            </option>
          ))}
        </select>

        {/* Agent Role Filter */}
        <select
          value={selectedAgentRole}
          onChange={(e) => setSelectedAgentRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {agentRoles.map((role) => (
            <option key={role} value={role} className="text-gray-900">
              {role === "All" ? "All Agent Roles" : `${role}s`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
