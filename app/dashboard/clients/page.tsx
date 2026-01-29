"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List, RefreshCcw, Loader2 } from "lucide-react";
import type { Client } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { 
  deleteClient as deleteClientState,
  setClients 
} from "@/lib/redux/slices/clientSlice";

// Server Actions
import { deleteClient as deleteClientServer } from "./actions";

// Hook
import { useClientData } from "@/hooks/clients/use-client-data";

// Component imports
import ClientStats from "./components/ClientStats";
import ClientFilters from "./components/ClientFilters";
import ClientListView from "./components/ClientListView";
import ClientGridView from "./components/ClientGridView";
import ClientDetailsModal from "./components/ClientDetailsModal";
import AddClientModal from "./components/AddClientModal";

import toast from "react-hot-toast";

export default function ClientsPage() {
  // 1. Initialize Hook
  const { refreshClients } = useClientData();

  const clients = useAppSelector((state) => state.clients.items);
  const isLoading = useAppSelector((state) => state.clients.loading);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // State
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Roles");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Memoized Filter Logic
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.id.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All Status" || client.status === selectedStatus;

      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Roles") {
        const agent = agents.find((a) => a.name === client.preferredAgent);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesStatus && matchesAgentRole;
    });
  }, [clients, searchQuery, selectedStatus, selectedAgentRole, agents]);

  // Handlers
  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  // 2. Optimized Delete Handler
  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this client?")) return;

    // Snapshot
    const previousClients = [...clients];

    // Optimistic Update
    dispatch(deleteClientState(id));
    toast.success("Client deleted successfully!");

    try {
      // Server Action
      const result = await deleteClientServer(id);
      if (result.error) throw new Error(result.error);
    } catch (error) {
      // Rollback
      console.error(error);
      toast.error("Failed to delete client");
      dispatch(setClients(previousClients));
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All Status");
    setSelectedAgentRole("All Roles");
    refreshClients(); // Manual refresh
    toast.success("Filters reset");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Directory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage relationships and track client portfolios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-white border border-gray-200 p-1 rounded-lg flex items-center shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list" ? "bg-gray-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid" ? "bg-gray-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

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
            Add Client
          </button>
        </div>
      </div>

      {/* Stats */}
      <ClientStats clients={clients} />

      {/* Filters */}
      <ClientFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
      />

      {/* Content View */}
      {isLoading && clients.length === 0 ? (
        <div className="w-full py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : viewMode === "list" ? (
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

      {/* Modals */}
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