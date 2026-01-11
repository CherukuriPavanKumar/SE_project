"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List, RefreshCcw } from "lucide-react";
import type { Deal } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteDeal as deleteDealAction } from "@/lib/redux/slices/dealSlice";

// Component imports
import DealStats from "./components/DealStats";
import DealFilters from "./components/DealFilters";
import DealTable from "./components/DealTable";
import DealKanban from "./components/DealKanban"; 
import DealDetailsModal from "./components/DealDetailsModal";
import AddDealModal from "./components/AddDealModal";

import toast from "react-hot-toast";

export default function DealsPage() {
  // Get data from Redux
  const deals = useAppSelector((state) => state.deals.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // State
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All Roles"); // Changed from specific agent to role
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All Payment Status");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        deal.leadName.toLowerCase().includes(query) ||
        deal.propertyTitle.toLowerCase().includes(query) ||
        deal.id.toLowerCase().includes(query);

      const matchesStage = selectedStage === "All Stages" || deal.dealStage === selectedStage;
      const matchesPayment = selectedPaymentStatus === "All Payment Status" || deal.paymentStatus === selectedPaymentStatus;

      // Agent Role Logic
      let matchesAgentRole = true;
      if (selectedAgentRole !== "All Roles") {
        const agent = agents.find((a) => a.name === deal.assignedAgent);
        matchesAgentRole = agent ? agent.role === selectedAgentRole : false;
      }

      return matchesSearch && matchesStage && matchesAgentRole && matchesPayment;
    });
  }, [deals, searchQuery, selectedStage, selectedAgentRole, selectedPaymentStatus, agents]);

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("All Stages");
    setSelectedAgentRole("All Roles");
    setSelectedPaymentStatus("All Payment Status");
    toast.success("Filters reset");
  };

  // Handler: View Details
  const handleViewDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDetailsModal(true);
  };

  // Handler: Delete Deal
  const handleDeleteDeal = (id: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      dispatch(deleteDealAction(id));
      toast.success("Deal deleted successfully!");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">Track negotiations and close transactions.</p>
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
              onClick={() => setViewMode("kanban")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "kanban" ? "bg-gray-100 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

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
            Create Deal
          </button>
        </div>
      </div>

      {/* Stats */}
      <DealStats deals={deals} />

      {/* Filters */}
      <DealFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
        selectedPaymentStatus={selectedPaymentStatus}
        setSelectedPaymentStatus={setSelectedPaymentStatus}
      />

      {/* Content View */}
      {viewMode === "list" ? (
        <DealTable
          deals={filteredDeals}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteDeal}
        />
      ) : (
        <DealKanban
          deals={filteredDeals}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modals */}
      {showDetailsModal && selectedDeal && (
        <DealDetailsModal
          deal={selectedDeal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddDealModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}