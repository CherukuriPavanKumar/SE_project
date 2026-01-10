import { Search } from "lucide-react";
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {leadStages.map((stage) => (
            <option key={stage} value={stage} className="text-gray-900">
              {stage}
            </option>
          ))}
        </select>

        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {leadSources.map((source) => (
            <option key={source} value={source} className="text-gray-900">
              {source}
            </option>
          ))}
        </select>

        <select
          value={selectedAgentRole}
          onChange={(e) => setSelectedAgentRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          <option value="All Agents" className="text-gray-900">
            All Agents
          </option>
          <option value="Employee" className="text-gray-900">
            Employee
          </option>
          <option value="Broker" className="text-gray-900">
            Broker
          </option>
        </select>
      </div>
    </div>
  );
}
