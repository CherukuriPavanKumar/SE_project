"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectAllTickets, selectTicketStats } from "@/lib/redux/slices/supportSlice";

import SupportHeader from "./components/SupportHeader";
import SupportStats from "./components/SupportStats";
import SupportFilters from "./components/SupportFilters";
import TicketList from "./components/TicketList";
import TicketDetailsModal from "./components/TicketDetailsModal";
import AddTicketModal from "./components/AddTicketModal";
import type { SupportTicket } from "@/lib/types";

export default function SupportPage() {
  const tickets = useAppSelector(selectAllTickets);
  const stats = useAppSelector(selectTicketStats);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "All Status" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "All Priorities" || ticket.priority === selectedPriority;
    const matchesCategory = selectedCategory === "All Categories" || ticket.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SupportHeader />
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Create Ticket
        </button>
      </div>
      
      <SupportStats stats={stats} />

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

      <TicketList tickets={filteredTickets} onViewTicket={handleViewTicket} />

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
