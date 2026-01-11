"use client";

import { useState, useMemo } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import type { Property } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteProperty as deletePropertyAction } from "@/lib/redux/slices/propertySlice";

// Component imports
import PropertyStats from "./components/PropertyStats";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import AddPropertyModal from "./components/AddPropertyModal";

import toast from "react-hot-toast";

export default function PropertiesPage() {
  const properties = useAppSelector((state) => state.properties.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // 1. Search (Title, Location, ID)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.id.toLowerCase().includes(query);

      // 2. Dropdown Filters
      const matchesType = selectedType === "All Types" || property.type === selectedType;
      const matchesStatus = selectedStatus === "All Status" || property.status === selectedStatus;

      // 3. Agent Role Filter
      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Agents") {
        const agent = agents.find((a) => a.name === property.listedBy);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesType && matchesStatus && matchesAgentRole;
    });
  }, [properties, searchQuery, selectedType, selectedStatus, selectedAgentRole, agents]);

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setSelectedAgentRole("All Agents");
    toast.success("Filters reset");
  };

  // Handler: View Details
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  // Handler: Delete Property
  const handleDeleteProperty = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this property?")) {
      dispatch(deletePropertyAction(id));
      toast.success("Property deleted successfully");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">Manage listings, track availability, and update status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats */}
      <PropertyStats properties={properties} />

      {/* Filters */}
      <PropertyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
      />

      {/* Grid */}
      <PropertyGrid
        properties={filteredProperties}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteProperty}
      />

      {/* Modals */}
      {showDetailsModal && selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddPropertyModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}