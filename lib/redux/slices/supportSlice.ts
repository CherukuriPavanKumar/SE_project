import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SupportTicket, TicketResponse } from "@/lib/types";
import type { RootState } from "../store";

interface SupportState {
  tickets: SupportTicket[];
}

const initialState: SupportState = {
  tickets: [
    {
      id: "TKT001",
      ticketNumber: "SUPP-2026-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      subject: "Unable to view property details",
      message: "I am trying to view the property details for Sunset Villa but the page is not loading. Can you please help?",
      category: "Technical",
      priority: "Medium",
      status: "Open",
      assignedTo: "John Doe",
      createdAt: "2026-01-08T10:30:00",
      updatedAt: "2026-01-08T11:15:00",
      responses: [
        {
          id: "RSP001",
          ticketId: "TKT001",
          message: "Thank you for contacting us. We are looking into this issue and will update you shortly.",
          author: "John Doe",
          authorType: "Agent",
          timestamp: "2026-01-08T11:15:00",
        },
      ],
      tags: ["website", "property-page"],
      source: "Website",
    },
    {
      id: "TKT002",
      ticketNumber: "SUPP-2026-002",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43211",
      subject: "Request for site visit",
      message: "I am interested in the Ocean View Apartment and would like to schedule a site visit this weekend.",
      category: "Sales",
      priority: "High",
      status: "In Progress",
      assignedTo: "Sarah Wilson",
      createdAt: "2026-01-08T14:20:00",
      updatedAt: "2026-01-08T15:00:00",
      responses: [
        {
          id: "RSP002",
          ticketId: "TKT002",
          message: "Hello Priya! We would be happy to arrange a site visit. Our agent will contact you shortly to confirm the date and time.",
          author: "Sarah Wilson",
          authorType: "Agent",
          timestamp: "2026-01-08T14:45:00",
        },
      ],
      tags: ["site-visit", "ocean-view-apartment"],
      source: "Website",
    },
    {
      id: "TKT003",
      ticketNumber: "SUPP-2026-003",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      subject: "Question about EMI options",
      message: "Do you offer EMI payment options for property purchases? What are the terms?",
      category: "General",
      priority: "Low",
      status: "New",
      createdAt: "2026-01-09T09:00:00",
      updatedAt: "2026-01-09T09:00:00",
      responses: [],
      tags: ["emi", "payment"],
      source: "Website",
    },
    {
      id: "TKT004",
      ticketNumber: "SUPP-2026-004",
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      phone: "+91 98765 43213",
      subject: "Delay in document processing",
      message: "I submitted my documents 2 weeks ago but haven't received any update. Please expedite the process.",
      category: "Complaint",
      priority: "Urgent",
      status: "In Progress",
      assignedTo: "Mike Johnson",
      createdAt: "2026-01-07T16:30:00",
      updatedAt: "2026-01-09T10:00:00",
      responses: [
        {
          id: "RSP003",
          ticketId: "TKT004",
          message: "We sincerely apologize for the delay. I have escalated your case to our documentation team. You should receive an update within 24 hours.",
          author: "Mike Johnson",
          authorType: "Agent",
          timestamp: "2026-01-09T10:00:00",
        },
      ],
      tags: ["documents", "urgent"],
      source: "Email",
    },
    {
      id: "TKT005",
      ticketNumber: "SUPP-2026-005",
      name: "Kiran Desai",
      email: "kiran.desai@example.com",
      subject: "Property pricing inquiry",
      message: "I would like to know the current pricing and available units for Green Valley Residency.",
      category: "Property Inquiry",
      priority: "Medium",
      status: "Resolved",
      assignedTo: "John Doe",
      createdAt: "2026-01-06T11:00:00",
      updatedAt: "2026-01-07T14:30:00",
      resolvedAt: "2026-01-07T14:30:00",
      responses: [
        {
          id: "RSP004",
          ticketId: "TKT005",
          message: "Thank you for your interest! Green Valley Residency has units starting from ₹45 lakhs. We have 2BHK and 3BHK options available. I have sent detailed pricing to your email.",
          author: "John Doe",
          authorType: "Agent",
          timestamp: "2026-01-06T15:00:00",
        },
        {
          id: "RSP005",
          ticketId: "TKT005",
          message: "Thank you for the information. I will review and get back to you.",
          author: "Kiran Desai",
          authorType: "Customer",
          timestamp: "2026-01-07T14:30:00",
        },
      ],
      tags: ["pricing", "green-valley"],
      source: "Website",
    },
  ],
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    addTicket: (state, action: PayloadAction<SupportTicket>) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action: PayloadAction<{ id: string; updates: Partial<SupportTicket> }>) => {
      const index = state.tickets.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = {
          ...state.tickets[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter((t) => t.id !== action.payload);
    },
    assignTicket: (state, action: PayloadAction<{ id: string; assignedTo: string }>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.assignedTo = action.payload.assignedTo;
        ticket.updatedAt = new Date().toISOString();
        if (ticket.status === "New") {
          ticket.status = "Open";
        }
      }
    },
    updateTicketStatus: (state, action: PayloadAction<{ id: string; status: SupportTicket["status"] }>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        ticket.updatedAt = new Date().toISOString();
        if (action.payload.status === "Resolved" || action.payload.status === "Closed") {
          ticket.resolvedAt = new Date().toISOString();
        }
      }
    },
    addResponse: (state, action: PayloadAction<TicketResponse>) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.responses.push(action.payload);
        ticket.updatedAt = new Date().toISOString();
        if (ticket.status === "New") {
          ticket.status = "Open";
        }
      }
    },
  },
});

export const {
  addTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateTicketStatus,
  addResponse,
} = supportSlice.actions;

export const selectAllTickets = (state: RootState) => state.support.tickets;
export const selectTicketById = (state: RootState, ticketId: string) =>
  state.support.tickets.find((t) => t.id === ticketId);

export const selectTicketsByStatus = (state: RootState, status: SupportTicket["status"]) =>
  state.support.tickets.filter((t) => t.status === status);

export const selectTicketStats = (state: RootState) => {
  const tickets = state.support.tickets;
  return {
    total: tickets.length,
    new: tickets.filter((t) => t.status === "New").length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    urgent: tickets.filter((t) => t.priority === "Urgent").length,
  };
};

export default supportSlice.reducer;
