"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Deal } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addDeal as addDealAction, deleteDeal as deleteDealAction } from "@/lib/redux/slices/dealSlice";

// Component imports
import DealStats from "./components/DealStats";
import DealFilters from "./components/DealFilters";
import DealTable from "./components/DealTable";
import DealDetailsModal from "./components/DealDetailsModal";
import AddDealModal from "./components/AddDealModal";

import toast from "react-hot-toast";

export default function DealsPage() {
  // Get data from Redux
  const deals = useAppSelector((state) => state.deals.items);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All Payment Status");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Filter and search deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = selectedStage === "All Stages" || deal.dealStage === selectedStage;
      const matchesAgent = selectedAgent === "All Agents" || deal.assignedAgent === selectedAgent;
      const matchesPayment = selectedPaymentStatus === "All Payment Status" || deal.paymentStatus === selectedPaymentStatus;

      return matchesSearch && matchesStage && matchesAgent && matchesPayment;
    });
  }, [deals, searchQuery, selectedStage, selectedAgent, selectedPaymentStatus]);

  // Handle view details
  const handleViewDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDetailsModal(true);
  };

  // Handle delete
  const handleDeleteDeal = (id: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      dispatch(deleteDealAction(id));
      toast.success("Deal deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals & Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage your deals pipeline</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Create Deal
        </button>
      </div>

      {/* Stats */}
      <DealStats deals={deals} />

      {/* Filters */}
      <DealFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        selectedPaymentStatus={selectedPaymentStatus}
        setSelectedPaymentStatus={setSelectedPaymentStatus}
      />

      {/* Deals Table */}
      <DealTable
        deals={filteredDeals}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteDeal}
      />

      {/* Modals */}
      {showDetailsModal && selectedDeal && (
        <DealDetailsModal
          deal={selectedDeal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && (
        <AddDealModal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
