"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";
import type { Lead, Property } from "@/lib/types";
import toast from "react-hot-toast";

// 1. Redux Imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  setLeads, // Required for Rollback
  updateLead as updateLeadState,
  deleteLead as deleteLeadState,
} from "@/lib/redux/slices/leadSlice";

// 2. Server Action Imports (The Middleware)
import { 
  deleteLead as deleteLeadServer, 
  updateLeadStage as updateLeadStageServer 
} from "./actions";

// 3. Custom Hooks
import { useLeadsData } from "@/hooks/leads/use-leads-data";

// 4. Component Imports
import LeadStats from "./components/LeadStats";
import LeadFilters from "./components/LeadFilters";
import LeadTable from "./components/LeadTable";
import StageChangeModal from "./components/StageChangeModal";
import AddLeadModal from "./components/AddLeadModal";
import LeadDetailsModal from "./components/LeadDetailsModal";
import PropertyDetailsModal from "../properties/components/PropertyDetailsModal";

export default function LeadsPage() {
  // Initialize Data Fetching (Middleware Bridge)
  const { refreshLeads } = useLeadsData();
  
  // Redux State Selectors
  const leads = useAppSelector((state) => state.leads.items);
  const isLoading = useAppSelector((state) => state.leads.loading);
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items); 
  const dispatch = useAppDispatch();

  // Local State: Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");

  // Local State: Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  // Local State: Selected Items
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // --- MEMOIZED FILTER LOGIC ---
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase();
      // Safe check for propertyInterest (handles nulls)
      const matchesProperty = lead.propertyInterest?.some(p => p.toLowerCase().includes(query)) || false;

      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        matchesProperty;

      const matchesStage = selectedStage === "All Stages" || lead.stage === selectedStage;
      const matchesSource = selectedSource === "All Sources" || lead.source === selectedSource;

      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Agents") {
        const agent = agents.find((a) => a.name === lead.assignedTo);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesStage && matchesSource && matchesAgentRole;
    });
  }, [leads, searchQuery, selectedStage, selectedSource, selectedAgentRole, agents]);

  // --- HANDLER: DELETE LEAD (Optimistic) ---
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;

    // 1. Snapshot previous state (for rollback)
    const previousLeads = [...leads];

    // 2. OPTIMISTIC UPDATE: Update UI Immediately
    dispatch(deleteLeadState(id));
    toast.success("Lead deleted", { id: "delete-lead" });
    setShowDetailsModal(false);

    try {
      // 3. Perform Server Action in background
      const result = await deleteLeadServer(id);

      if (result.error) {
        throw new Error(result.error);
      }
      // Success! UI is already correct.

    } catch (error) {
      // 4. ROLLBACK if server fails
      console.error("Delete failed:", error);
      toast.error("Failed to delete. Restoring...", { id: "delete-lead" });
      dispatch(setLeads(previousLeads)); 
    }
  };

  // --- HANDLER: STAGE CHANGE (Optimistic with Move Logic) ---
  const handleStageChange = useCallback(async (lead: Lead, newStage: string) => {
    // Close modals immediately for better UX
    setShowStageModal(false);
    setShowDetailsModal(false);

    // 1. Snapshot previous state
    const previousLeads = [...leads];
    
    // 2. OPTIMISTIC UPDATE
    if (newStage === "Closed") {
      // If closing, REMOVE it from the list immediately (it moves to Clients)
      dispatch(deleteLeadState(lead.id)); 
      toast.success(`${lead.name} moved to Clients! 🎉`, { id: "stage-update" });
    } else {
      // Normal update for other stages
      dispatch(updateLeadState({ id: lead.id, data: { stage: newStage } }));
      
      if (newStage === "Discarded") {
        toast.success("Lead marked as discarded", { id: "stage-update" });
      } else {
        toast.success(`Moved to ${newStage}`, { id: "stage-update" });
      }
    }

    try {
      // 3. Server Action
      const result = await updateLeadStageServer(lead.id, newStage);
      
      if (result.error) {
        throw new Error(result.error);
      }

    } catch (error) {
      // 4. Rollback
      console.error("Stage update failed:", error);
      toast.error("Update failed. Reverting...", { id: "stage-update" });
      dispatch(setLeads(previousLeads));
    }
    
    setSelectedLead(null);
  }, [dispatch, leads]); // 'leads' dependency is crucial for the snapshot

  // --- HELPER HANDLERS ---
  const handleViewProperty = (propertyName: string) => {
    const property = properties.find(p => p.title === propertyName);
    if (property) {
        setSelectedProperty(property);
        setShowPropertyDetails(true);
    } else {
        toast.error("Property details not found");
    }
  };

  const handleViewLeadFromProperty = (lead: Lead) => {
      setSelectedLead(lead);
      setShowPropertyDetails(false);
      setShowDetailsModal(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All Stages");
    setSelectedSource("All Sources");
    setSelectedAgentRole("All Agents");
    refreshLeads(); // Manual refresh via hook
    toast.success("Filters reset");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track, nurture, and convert your leads into clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Reset
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <LeadStats leads={leads} />

      {/* Filters Bar */}
      <LeadFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
      />

      {/* Main Table Content */}
      {isLoading && leads.length === 0 ? (
        <div className="w-full py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <LeadTable
            leads={filteredLeads}
            onStageClick={(lead) => {
                setSelectedLead(lead);
                setShowStageModal(true);
            }}
            onDelete={handleDeleteLead}
            onViewDetails={(lead) => {
                setSelectedLead(lead);
                setShowDetailsModal(true);
            }}
        />
      )}

      {/* --- MODALS --- */}
      
      {/* 1. Stage Change Modal */}
      {showStageModal && selectedLead && (
        <StageChangeModal
          lead={selectedLead}
          onClose={() => setShowStageModal(false)}
          onStageChange={handleStageChange}
        />
      )}

      {/* 2. Lead Details Modal */}
      {showDetailsModal && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setShowDetailsModal(false)}
          onStageChange={handleStageChange}
          onDelete={() => handleDeleteLead(selectedLead.id)}
          onViewProperty={handleViewProperty}
        />
      )}

      {/* 3. Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
            property={selectedProperty}
            interestedLeads={leads.filter(l => l.propertyInterest?.includes(selectedProperty.title))}
            onClose={() => setShowPropertyDetails(false)}
            onViewLead={handleViewLeadFromProperty}
        />
      )}

      {/* 4. Add Lead Modal */}
      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}