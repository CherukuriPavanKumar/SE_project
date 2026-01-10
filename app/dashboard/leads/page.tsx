"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Lead } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  // addLead as addLeadAction,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleStageChange = (lead: Lead, newStage: string) => {
    if (newStage === "Closed") {
      const newClient = {
        id: `C${String(Date.now()).slice(-3)}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: "",
        totalPurchases: 1,
        totalValue: lead.budget,
        propertiesOwned: [`Property from lead ${lead.id}`],
        status: "Active" as const,
        joinedDate: new Date().toISOString().split("T")[0],
        lastInteraction: new Date().toISOString().split("T")[0],
        preferredAgent: lead.assignedTo,
        tags: ["New Client", "Converted Lead"],
        notes: `Converted from lead ${lead.id}. Budget: ${lead.budget}. ${lead.notes || ""}`,
      };

      dispatch(addClientAction(newClient));
      dispatch(updateLeadAction({ id: lead.id, data: { stage: "Closed" } }));

      toast.success(`${lead.name} converted to client! Check the Clients page.`, {
        duration: 5000,
      });
    } else if (newStage === "Discarded") {
      dispatch(updateLeadAction({ id: lead.id, data: { stage: "Discarded" } }));
      toast.error(`${lead.name} marked as discarded`, { icon: "❌" });
    } else {
      dispatch(updateLeadAction({ id: lead.id, data: { stage: newStage } }));
      toast.success(`Lead stage updated to ${newStage}`);
    }
    setShowStageModal(false);
    setSelectedLead(null);
  };

  const openStageModal = (lead: Lead) => {
    setSelectedLead(lead);
    setShowStageModal(true);
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLeadAction(id));
      toast.success("Lead deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all your leads</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add New Lead
        </button>
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

      <LeadTable
        leads={filteredLeads}
        onStageClick={openStageModal}
        onDelete={handleDeleteLead}
      />

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
