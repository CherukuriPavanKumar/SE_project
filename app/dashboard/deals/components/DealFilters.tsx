import { Search, Filter } from "lucide-react";
import { dealStages, paymentStatuses } from "@/lib/constants";

interface DealFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStage: string;
  setSelectedStage: (value: string) => void;
  selectedAgentRole: string;
  setSelectedAgentRole: (value: string) => void;
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (value: string) => void;
}

export default function DealFilters({
  searchQuery,
  setSearchQuery,
  selectedStage,
  setSelectedStage,
  selectedAgentRole,
  setSelectedAgentRole,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
}: DealFiltersProps) {
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Deal ID, Lead, or Property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* Stage Filter */}
        <div className="relative">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {dealStages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Payment Status Filter */}
        <div className="relative">
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Agent Role Filter (Fixed logic) */}
        <div className="relative">
          <select
            value={selectedAgentRole}
            onChange={(e) => setSelectedAgentRole(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="All Roles">All Roles</option>
            <option value="Employee">Employee</option>
            <option value="Broker">Broker</option>
          </select>
        </div>
      </div>
    </div>
  );
}