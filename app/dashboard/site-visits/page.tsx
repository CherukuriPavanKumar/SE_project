"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
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
import SiteVisitDetailsModal from "./components/SiteVisitDetailsModal";
import AddSiteVisitModal from "./components/AddSiteVisitModal";

import toast from "react-hot-toast";

export default function SiteVisitsPage() {
  // Get data from Redux
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const agents = useAppSelector((state) => state.agents.items);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAgentRole, setSelectedAgentRole] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<SiteVisit | null>(null);

  // Filter and search site visits
  const filteredVisits = useMemo(() => {
    return siteVisits.filter((visit) => {
      const matchesSearch =
        visit.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.id.toLowerCase().includes(searchQuery.toLowerCase());

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

  // Handle view details
  const handleViewDetails = (visit: SiteVisit) => {
    setSelectedVisit(visit);
    setShowDetailsModal(true);
  };

  // Handle delete
  const handleDeleteVisit = (id: string) => {
    if (confirm("Are you sure you want to delete this site visit?")) {
      dispatch(deleteSiteVisitAction(id));
      toast.success("Site visit deleted successfully!");
    }
  };

  // Handle status change
  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch(updateSiteVisitAction({ id, data: { status: newStatus } }));
    toast.success(`Site visit marked as ${newStatus.toLowerCase()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Visits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage property site visits
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Schedule Visit
        </button>
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

      {/* Visits Table */}
      <SiteVisitTable
        visits={filteredVisits}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteVisit}
        onStatusChange={handleStatusChange}
      />

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
