import { Search, Filter } from "lucide-react";
import { ticketStatuses, ticketPriorities, ticketCategories } from "@/lib/constants";

interface SupportFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedPriority: string;
  setSelectedPriority: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

export default function SupportFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedCategory,
  setSelectedCategory,
}: SupportFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500 transition-all"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {ticketStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {ticketPriorities.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-700 bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            {ticketCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}