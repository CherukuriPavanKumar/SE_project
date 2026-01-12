"use client";

import { useState, useMemo } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import type { Agent } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteAgent as deleteAgentAction } from "@/lib/redux/slices/agentSlice";

// Component imports
import AgentStats from "./components/AgentStats";
import AgentFilters from "./components/AgentFilters";
import AgentListView from "./components/AgentListView";
import AgentDetailsModal from "./components/AgentDetailsModal";
import AddAgentModal from "./components/AddAgentModal";

import toast from "react-hot-toast";

export default function AgentsPage() {
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.phone.includes(query) ||
        agent.id.toLowerCase().includes(query);

      const matchesRole = selectedRole === "All Roles" || agent.role === selectedRole;
      const matchesStatus = selectedStatus === "All Status" || agent.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [agents, searchQuery, selectedRole, selectedStatus]);

  // Handlers
  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleDeleteAgent = (id: string) => {
    if (confirm("Are you sure you want to remove this agent?")) {
      dispatch(deleteAgentAction(id));
      toast.success("Agent removed successfully");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("All Roles");
    setSelectedStatus("All Status");
    toast.success("Filters reset");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents & Brokers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your team performance and assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <AgentStats agents={agents} />

      {/* Filters */}
      <AgentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* List View */}
      <AgentListView
        agents={filteredAgents}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteAgent}
      />

      {/* Modals */}
      {showDetailsModal && selectedAgent && (
        <AgentDetailsModal
          agent={selectedAgent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddAgentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}