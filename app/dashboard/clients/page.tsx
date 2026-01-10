"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Client } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteClient as deleteClientAction } from "@/lib/redux/slices/clientSlice";

import ClientStats from "./components/ClientStats";
import ClientFilters from "./components/ClientFilters";
import ClientListView from "./components/ClientListView";
import ClientGridView from "./components/ClientGridView";
import ClientDetailsModal from "./components/ClientDetailsModal";
import AddClientModal from "./components/AddClientModal";
import toast from "react-hot-toast";

export default function ClientsPage() {
  const clients = useAppSelector((state) => state.clients.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Agents");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "All Status" || client.status === selectedStatus;

      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Agents") {
        const agent = agents.find((a) => a.name === client.preferredAgent);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesStatus && matchesAgentRole;
    });
  }, [clients, searchQuery, selectedStatus, selectedAgentRole, agents]);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClientAction(id));
      toast.success("Client deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer relationships and track their journey
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add Client
        </button>
      </div>

      <ClientStats clients={clients} />

      <ClientFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === "list" ? (
        <ClientListView
          clients={filteredClients}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteClient}
        />
      ) : (
        <ClientGridView
          clients={filteredClients}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteClient}
        />
      )}

      {showDetailsModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
