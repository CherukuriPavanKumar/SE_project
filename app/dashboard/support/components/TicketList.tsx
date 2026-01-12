import { Ticket, User, Mail, Clock, Tag, Eye } from "lucide-react";
import type { SupportTicket } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface TicketListProps {
  tickets: SupportTicket[];
  onViewTicket: (ticket: SupportTicket) => void;
}

export default function TicketList({ tickets, onViewTicket }: TicketListProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-purple-50 text-purple-700 border-purple-100";
      case "Open": return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Progress": return "bg-orange-50 text-orange-700 border-orange-100";
      case "Resolved": return "bg-green-50 text-green-700 border-green-100";
      case "Closed": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-600 bg-red-50 ring-red-600/20";
      case "High": return "text-orange-600 bg-orange-50 ring-orange-600/20";
      case "Medium": return "text-blue-600 bg-blue-50 ring-blue-600/20";
      default: return "text-gray-600 bg-gray-50 ring-gray-600/20";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">Ticket</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Priority</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                  No tickets found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => onViewTicket(ticket)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-50 rounded-md text-gray-400">
                        <Ticket className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ticket.ticketNumber}</p>
                        <p className="text-xs text-gray-500">{ticket.source}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        {ticket.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {ticket.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="font-medium text-gray-900 truncate" title={ticket.subject}>{ticket.subject}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {ticket.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded border border-gray-200">
                          <Tag className="h-2.5 w-2.5" /> {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                          {ticket.assignedTo.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{ticket.assignedTo.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details" onClick={() => onViewTicket(ticket)}>
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}