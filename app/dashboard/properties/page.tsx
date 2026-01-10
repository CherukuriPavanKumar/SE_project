"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Property } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  addProperty as addPropertyAction,
  deleteProperty as deletePropertyAction,
} from "@/lib/redux/slices/propertySlice";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All Types" || property.type === selectedType;
      const matchesStatus = selectedStatus === "All Status" || property.status === selectedStatus;

      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Agents") {
        const agent = agents.find((a) => a.name === property.listedBy);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesType && matchesStatus && matchesAgentRole;
    });
  }, [properties, searchQuery, selectedType, selectedStatus, selectedAgentRole, agents]);

  // Handle view details
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  // Handle delete
  const handleDeleteProperty = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      dispatch(deletePropertyAction(id));
      toast.success("Property deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your property listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
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

      {/* Properties Grid */}
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
