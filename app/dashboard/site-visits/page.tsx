"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List, RefreshCcw } from "lucide-react";
import type { SiteVisit } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  updateSiteVisit as updateSiteVisitAction,
  deleteSiteVisit as deleteSiteVisitAction,
} from "@/lib/redux/slices/siteVisitSlice";

// Component imports
import SiteVisitStats from "./components/SiteVisitStats";
import SiteVisitFilters from "./components/SiteVisitFilters";
import SiteVisitTable from "./components/SiteVisitTable";
import SiteVisitKanban from "./components/SiteVisitKanban";
import SiteVisitDetailsModal from "./components/SiteVisitDetailsModal";
import AddSiteVisitModal from "./components/AddSiteVisitModal";

import toast from "react-hot-toast";

export default function SiteVisitsPage() {
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  // State
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<SiteVisit | null>(null);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredVisits = useMemo(() => {
    return siteVisits.filter((visit) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        visit.leadName.toLowerCase().includes(query) ||
        visit.propertyTitle.toLowerCase().includes(query) ||
        visit.id.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All Status" || visit.status === selectedStatus;

      let matchesAgentRole = true;
      if (selectedAgentRole !== "All") {
        const visitAgent = agents.find((a) => a.name === visit.assignedAgent);
        matchesAgentRole = visitAgent?.role === selectedAgentRole;
      }

      return matchesSearch && matchesStatus && matchesAgentRole;
    });
  }, [siteVisits, searchQuery, selectedStatus, selectedAgentRole, agents]);

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All Status");
    setSelectedAgentRole("All");
    toast.success("Filters reset");
  };

  // Handler: View Details
  const handleViewDetails = (visit: SiteVisit) => {
    setSelectedVisit(visit);
    setShowDetailsModal(true);
  };

  // Handler: Delete
  const handleDeleteVisit = (id: string) => {
    if (confirm("Are you sure you want to delete this site visit?")) {
      dispatch(deleteSiteVisitAction(id));
      toast.success("Site visit deleted successfully");
    }
  };

  // Handler: Status Change
  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch(updateSiteVisitAction({ id, data: { status: newStatus } }));
    toast.success(`Marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Visits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule property tours and track outcomes.
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
            className="flex items-center gap-2 px-3 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Schedule Visit
          </button>
        </div>
      </div>

      {/* Stats */}
      <SiteVisitStats visits={siteVisits} />

      {/* Filters */}
      <SiteVisitFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedAgentRole={selectedAgentRole}
        setSelectedAgentRole={setSelectedAgentRole}
      />

      {/* Content View */}
      {viewMode === "list" ? (
        <SiteVisitTable
          visits={filteredVisits}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteVisit}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <SiteVisitKanban
          visits={filteredVisits}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modals */}
      {showDetailsModal && selectedVisit && (
        <SiteVisitDetailsModal
          visit={selectedVisit}
          onClose={() => setShowDetailsModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {showAddModal && <AddSiteVisitModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}