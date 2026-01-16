"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import type { Property, Lead } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteProperty as deletePropertyAction } from "@/lib/redux/slices/propertySlice";
// Import lead actions for the LeadDetailsModal
import { updateLead as updateLeadAction, deleteLead as deleteLeadAction } from "@/lib/redux/slices/leadSlice";
import { addClient as addClientAction } from "@/lib/redux/slices/clientSlice";

// Component imports
import PropertyStats from "./components/PropertyStats";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import AddPropertyModal from "./components/AddPropertyModal";
// Reuse Lead Details Modal
import LeadDetailsModal from "../leads/components/LeadDetailsModal";

import toast from "react-hot-toast";

export default function PropertiesPage() {
  const properties = useAppSelector((state) => state.properties.items);
  const leads = useAppSelector((state) => state.leads.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false); 
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Memoized Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.id.toLowerCase().includes(query);

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

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setSelectedAgentRole("All Agents");
    toast.success("Filters reset");
  };

  // Property Handlers
  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  // NEW: Handler for clicking a property inside the Lead Modal
  const handleViewPropertyByName = (propertyName: string) => {
    const property = properties.find(p => p.title === propertyName);
    if (property) {
      setSelectedProperty(property);
      setShowPropertyDetails(true);
      // Optional: Close lead modal if you want to switch context completely
      // setShowLeadDetails(false); 
    } else {
      toast.error("Property not found");
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this property?")) {
      dispatch(deletePropertyAction(id));
      toast.success("Property deleted successfully");
    }
  };

  // Lead Handlers
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleLeadStageChange = useCallback((lead: Lead, newStage: string) => {
    if (newStage === "Closed") {
      const newClient = {
        id: `C${String(Date.now()).slice(-3)}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: "",
        totalPurchases: 1,
        totalValue: lead.budget,
        propertiesOwned: lead.propertyInterest && lead.propertyInterest.length > 0 ? lead.propertyInterest : [`Converted from Lead ${lead.id}`],
        status: "Active" as const,
        joinedDate: new Date().toISOString().split("T")[0],
        lastInteraction: new Date().toISOString().split("T")[0],
        preferredAgent: lead.assignedTo,
        tags: ["Converted Lead"],
        notes: `Converted from lead via Property Page.`,
      };

      dispatch(addClientAction(newClient));
      dispatch(updateLeadAction({ id: lead.id, data: { stage: "Closed" } }));
      toast.success(`${lead.name} converted to Client! 🎉`);
    } else if (newStage === "Discarded") {
      dispatch(updateLeadAction({ id: lead.id, data: { stage: "Discarded" } }));
      toast.error(`${lead.name} marked as discarded`);
    } else {
      dispatch(updateLeadAction({ id: lead.id, data: { stage: newStage } }));
      toast.success(`Stage updated to ${newStage}`);
    }
    setShowLeadDetails(false);
  }, [dispatch]);

  const handleDeleteLead = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLeadAction(id));
      toast.success("Lead deleted");
      setShowLeadDetails(false);
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
            className="flex items-center gap-2 px-3 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
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
        allLeads={leads}
        onViewDetails={handleViewProperty}
        onDelete={handleDeleteProperty}
      />

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          interestedLeads={leads.filter(lead => lead.propertyInterest?.includes(selectedProperty.title))}
          onClose={() => setShowPropertyDetails(false)}
          onViewLead={handleViewLead}
        />
      )}

      {/* Lead Details Modal (Stacked on top) */}
      {showLeadDetails && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setShowLeadDetails(false)}
          onStageChange={handleLeadStageChange}
          onDelete={() => handleDeleteLead(selectedLead.id)}
          onViewProperty={handleViewPropertyByName} // Fixed: Passed the handler here
        />
      )}

      {showAddModal && <AddPropertyModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}