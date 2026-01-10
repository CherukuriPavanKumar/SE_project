import { Search } from "lucide-react";
import { dealStages, paymentStatuses } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { useMemo } from "react";

interface DealFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStage: string;
  setSelectedStage: (value: string) => void;
  selectedAgent: string;
  setSelectedAgent: (value: string) => void;
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (value: string) => void;
}

export default function DealFilters({
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  selectedAgent,
  setSelectedAgent,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
}: DealFiltersProps) {
  const agents = useAppSelector((state) => state.agents.items);

  const activeAgents = useMemo(() => {
    return agents.filter((agent) => agent.status === "Active");
  }, [agents]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {dealStages.map((stage) => (
            <option key={stage} value={stage} className="text-gray-900">
              {stage}
            </option>
          ))}
        </select>

        {/* Payment Status Filter */}
        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {paymentStatuses.map((status) => (
            <option key={status} value={status} className="text-gray-900">
              {status}
            </option>
          ))}
        </select>

        {/* Agent Filter */}
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          <option value="All Agents">All Agents</option>
          {activeAgents.map((agent) => (
            <option key={agent.id} value={agent.name} className="text-gray-900">
              {agent.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
