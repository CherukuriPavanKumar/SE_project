"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCcw, Loader2 } from "lucide-react";
import type { Lead, Property } from "@/lib/types";

// 1. Rename Redux action to avoid conflict
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  updateLead as updateLeadState,
  deleteLead as deleteLeadState, // Rename this
} from "@/lib/redux/slices/leadSlice";

// 2. Import Server Action (The Middleware)
import { deleteLead as deleteLeadServer } from "./actions";

import LeadStats from "./components/LeadStats";
import LeadFilters from "./components/LeadFilters";
import LeadTable from "./components/LeadTable";
import StageChangeModal from "./components/StageChangeModal";
import AddLeadModal from "./components/AddLeadModal";
import LeadDetailsModal from "./components/LeadDetailsModal";
import PropertyDetailsModal from "../properties/components/PropertyDetailsModal";
import { useLeadsData } from "@/hooks/leads/use-leads-data";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const { refreshLeads } = useLeadsData();
  
  const leads = useAppSelector((state) => state.leads.items);
  const isLoading = useAppSelector((state) => state.leads.loading);
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items); 
  const dispatch = useAppDispatch();

  // ... [Keep your Filter States & Memo logic exactly the same] ...
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter Logic (Keep as is)
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase();
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

  // ... [Keep helper functions like handleViewProperty] ...

  // 3. UPDATED DELETE HANDLER
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;

    // A. Optimistic Update (Optional): Remove from UI immediately
    // dispatch(deleteLeadState(id)); 

    try {
      toast.loading("Deleting lead...", { id: "delete-lead" });
      
      // B. Call Middleware (Server Action)
      const result = await deleteLeadServer(id);

      if (result.error) {
        throw new Error(result.error);
      }

      // C. On Success: Update Redux State to match DB
      dispatch(deleteLeadState(id));
      
      toast.success("Lead deleted successfully", { id: "delete-lead" });
      setShowDetailsModal(false); // Close modal if open

    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete lead", { id: "delete-lead" });
      
      // If you did step A (Optimistic Update), you would undo it here by refreshing data
      // refreshLeads(); 
    }
  };

  const handleStageChange = useCallback((lead: Lead, newStage: string) => {
    if (newStage === "Closed") {
      dispatch(updateLeadState({ id: lead.id, data: { stage: "Closed" } }));
      toast.success(`${lead.name} converted to Client! 🎉`);
    } else if (newStage === "Discarded") {
      dispatch(updateLeadState({ id: lead.id, data: { stage: "Discarded" } }));
      toast.error(`${lead.name} marked as discarded`);
    } else {
      dispatch(updateLeadState({ id: lead.id, data: { stage: newStage } }));
      toast.success(`Stage updated to ${newStage}`);
    }
    setShowStageModal(false);
    setShowDetailsModal(false);
    setSelectedLead(null);
  }, [dispatch]);

  // ... [Keep your Return Statement exactly the same] ...
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* ... Header ... */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* ... Title ... */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
           <p className="mt-1 text-sm text-gray-500">Track, nurture, and convert your leads into clients.</p>
        </div>
        <div className="flex items-center gap-3">
            {/* ... Buttons ... */}
            <button
                onClick={() => {
                    setSearchQuery("");
                    setSelectedStage("All Stages");
                    setSelectedSource("All Sources");
                    setSelectedAgentRole("All Agents");
                    refreshLeads();
                    toast.success("Filters reset");
                }}
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

      <LeadStats leads={leads} />

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
            onDelete={handleDeleteLead} // This now calls the Async function
            onViewDetails={(lead) => {
                setSelectedLead(lead);
                setShowDetailsModal(true);
            }}
        />
      )}

      {/* ... Keep your Modals exactly as they are ... */}
      {showStageModal && selectedLead && (
        <StageChangeModal
          lead={selectedLead}
          onClose={() => setShowStageModal(false)}
          onStageChange={handleStageChange}
        />
      )}

      {showDetailsModal && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setShowDetailsModal(false)}
          onStageChange={handleStageChange}
          onDelete={() => handleDeleteLead(selectedLead.id)} // This also calls the Async function
          onViewProperty={(propertyName) => {
             const property = properties.find(p => p.title === propertyName);
             if (property) {
                 setSelectedProperty(property);
                 setShowPropertyDetails(true);
             } else {
                 toast.error("Property details not found");
             }
          }}
        />
      )}

      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
            property={selectedProperty}
            interestedLeads={leads.filter(l => l.propertyInterest?.includes(selectedProperty.title))}
            onClose={() => setShowPropertyDetails(false)}
            onViewLead={(lead) => {
                setSelectedLead(lead);
                setShowPropertyDetails(false);
                setShowDetailsModal(true);
            }}
        />
      )}

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}