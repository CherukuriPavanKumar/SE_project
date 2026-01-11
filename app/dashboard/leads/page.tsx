"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import type { Lead } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  updateLead as updateLeadAction,
  deleteLead as deleteLeadAction,
} from "@/lib/redux/slices/leadSlice";
import { addClient as addClientAction } from "@/lib/redux/slices/clientSlice";

import LeadStats from "./components/LeadStats";
import LeadFilters from "./components/LeadFilters";
import LeadTable from "./components/LeadTable";
import StageChangeModal from "./components/StageChangeModal";
import AddLeadModal from "./components/AddLeadModal";

import toast from "react-hot-toast";

export default function LeadsPage() {
  const leads = useAppSelector((state) => state.leads.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Search Filter (Name, Phone, Email)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.email.toLowerCase().includes(query);

      // 2. Dropdown Filters
      const matchesStage = selectedStage === "All Stages" || lead.stage === selectedStage;
      const matchesSource = selectedSource === "All Sources" || lead.source === selectedSource;

      // 3. Agent Role Filter
      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Agents") {
        const agent = agents.find((a) => a.name === lead.assignedTo);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesStage && matchesSource && matchesAgentRole;
    });
  }, [leads, searchQuery, selectedStage, selectedSource, selectedAgentRole, agents]);

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All Stages");
    setSelectedSource("All Sources");
    setSelectedAgentRole("All Agents");
    toast.success("Filters reset");
  };

  // Handler: Change Stage (and Convert to Client)
  const handleStageChange = useCallback((lead: Lead, newStage: string) => {
    if (newStage === "Closed") {
      const newClient = {
        id: `C${String(Date.now()).slice(-3)}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: "",
        totalPurchases: 1,
        totalValue: lead.budget, // Assuming budget becomes value
        propertiesOwned: [`Property via Lead ${lead.id}`],
        status: "Active" as const,
        joinedDate: new Date().toISOString().split("T")[0],
        lastInteraction: new Date().toISOString().split("T")[0],
        preferredAgent: lead.assignedTo,
        tags: ["Converted Lead"],
        notes: `Converted from lead. ${lead.notes || ""}`,
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
    setShowStageModal(false);
    setSelectedLead(null);
  }, [dispatch]);

  // Handler: Delete Lead
  const handleDeleteLead = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this lead?")) {
      dispatch(deleteLeadAction(id));
      toast.success("Lead deleted successfully");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
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
            Add New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <LeadStats leads={leads} />

      {/* Filter Bar */}
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

      {/* Data Table */}
      <LeadTable
        leads={filteredLeads}
        onStageClick={(lead) => {
          setSelectedLead(lead);
          setShowStageModal(true);
        }}
        onDelete={handleDeleteLead}
      />

      {/* Modals */}
      {showStageModal && selectedLead && (
        <StageChangeModal
          lead={selectedLead}
          onClose={() => setShowStageModal(false)}
          onStageChange={handleStageChange}
        />
      )}

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}