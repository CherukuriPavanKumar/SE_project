import { Search, Filter } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search Bar - Takes up more space */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name, Phone, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-7 flex flex-col sm:flex-row gap-3">
          <div className="relative w-full">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {leadStages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-full">
             <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              {leadSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full">
            <select
              value={selectedAgentRole}
              onChange={(e) => setSelectedAgentRole(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="All Agents">All Roles</option>
              <option value="Employee">Employees</option>
              <option value="Broker">Brokers</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}