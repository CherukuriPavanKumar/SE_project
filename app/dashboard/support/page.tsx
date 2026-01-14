"use client";

import { useState, useMemo } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectAllTickets } from "@/lib/redux/slices/supportSlice";

import SupportStats from "./components/SupportStats";
import SupportFilters from "./components/SupportFilters";
import TicketList from "./components/TicketList";
import TicketDetailsModal from "./components/TicketDetailsModal";
import AddTicketModal from "./components/AddTicketModal";
import type { SupportTicket } from "@/lib/types";

import toast from "react-hot-toast";

export default function SupportPage() {
  const tickets = useAppSelector(selectAllTickets);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // Modals State
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // ⚡ OPTIMIZATION: Memoized Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ticket.ticketNumber.toLowerCase().includes(query) ||
        ticket.name.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query);

      const matchesStatus = selectedStatus === "All Status" || ticket.status === selectedStatus;
      const matchesPriority = selectedPriority === "All Priorities" || ticket.priority === selectedPriority;
      const matchesCategory = selectedCategory === "All Categories" || ticket.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchQuery, selectedStatus, selectedPriority, selectedCategory]);

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All Status");
    setSelectedPriority("All Priorities");
    setSelectedCategory("All Categories");
    toast.success("Filters reset");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resolve customer issues and manage inquiries efficiently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            New Ticket
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <SupportStats tickets={tickets} />

      {/* Filters */}
      <SupportFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Ticket List */}
      <TicketList tickets={filteredTickets} onViewTicket={handleViewTicket} />

      {/* Modals */}
      {showDetailsModal && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddTicketModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}