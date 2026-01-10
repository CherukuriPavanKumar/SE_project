import { Search } from "lucide-react";
import { documentTypes, documentStatuses, relatedToOptions } from "@/lib/constants";

interface DocumentFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedRelatedTo: string;
  setSelectedRelatedTo: (value: string) => void;
}

export default function DocumentFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedRelatedTo,
  setSelectedRelatedTo,
}: DocumentFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {documentTypes.map((type) => (
            <option key={type} value={type} className="text-gray-900">
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {documentStatuses.map((status) => (
            <option key={status} value={status} className="text-gray-900">
              {status}
            </option>
          ))}
        </select>

        <select
          value={selectedRelatedTo}
          onChange={(e) => setSelectedRelatedTo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lgDocumentFilters.tsx focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {relatedToOptions.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option === "All" ? "All Categories" : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
