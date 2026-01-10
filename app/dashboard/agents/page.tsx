"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Agent } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteAgent as deleteAgentAction } from "@/lib/redux/slices/agentSlice";

import AgentStats from "./components/AgentStats";
import AgentFilters from "./components/AgentFilters";
import AgentGrid from "./components/AgentGrid";
import AgentDetailsModal from "./components/AgentDetailsModal";
import AddAgentModal from "./components/AddAgentModal";

import toast from "react-hot-toast";

export default function AgentsPage() {
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.phone.includes(searchQuery) ||
        agent.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === "All" || agent.role === selectedRole;
      const matchesStatus = selectedStatus === "All" || agent.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [agents, searchQuery, selectedRole, selectedStatus]);

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleDeleteAgent = (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      dispatch(deleteAgentAction(id));
      toast.success("Agent deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your team of agents and brokers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Agent
        </button>
      </div>

      <AgentStats agents={agents} />

      <AgentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <AgentGrid
        agents={filteredAgents}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteAgent}
      />

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
