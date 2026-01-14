import { useState } from "react";
import { X, User, Mail, Phone, Tag, Send, Clock } from "lucide-react";
import type { SupportTicket } from "@/lib/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateTicketStatus, assignTicket, addResponse } from "@/lib/redux/slices/supportSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface TicketDetailsModalProps {
  ticket: SupportTicket;
  onClose: () => void;
}

export default function TicketDetailsModal({ ticket, onClose }: TicketDetailsModalProps) {
  const dispatch = useAppDispatch();
  const currentUser = { name: "Admin User", role: "Admin" }; 
  
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "text-red-600 bg-red-50 ring-red-600/20";
      case "High": return "text-orange-600 bg-orange-50 ring-orange-600/20";
      case "Medium": return "text-blue-600 bg-blue-50 ring-blue-600/20";
      default: return "text-gray-600 bg-gray-50 ring-gray-600/20";
    }
  };

  const handleStatusChange = (newStatus: SupportTicket["status"]) => {
    dispatch(updateTicketStatus({ id: ticket.id, status: newStatus }));
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAssignToMe = () => {
    dispatch(assignTicket({ id: ticket.id, assignedTo: currentUser.name }));
    toast.success("Ticket assigned to you");
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const newResponse = {
      id: `RSP${Date.now()}`,
      ticketId: ticket.id,
      message: responseMessage,
      author: currentUser.name,
      authorType: "Agent" as const,
      timestamp: new Date().toISOString(),
    };

    dispatch(addResponse(newResponse));
    setResponseMessage("");
    setIsSubmitting(false);
    toast.success("Response sent");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{ticket.ticketNumber}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ring-1 ring-inset ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{ticket.subject}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row h-[75vh]">
            
            {/* Left: Conversation (Scrollable) */}
            <div className="flex-1 flex flex-col border-r border-gray-100 bg-gray-50/30">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Original Message */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                  <div className="absolute top-6 left-[-10px] w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45 hidden"></div>
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm shadow-inner border border-white">
                        {ticket.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{ticket.name}</p>
                        <p className="text-xs text-gray-500">Customer via {ticket.source}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{format(new Date(ticket.createdAt), "h:mm a")}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                </div>

                {/* Responses */}
                {ticket.responses.map((response) => (
                  <div key={response.id} className={`flex gap-4 ${response.authorType === "Agent" ? "justify-end" : "justify-start"}`}>
                    {response.authorType !== "Agent" && (
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex shrink-0 items-center justify-center text-gray-600 font-bold text-xs mt-2 shadow-sm border border-gray-200">
                        {response.author.charAt(0)}
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl p-5 shadow-sm relative ${
                      response.authorType === "Agent" 
                        ? "bg-green-600 text-white rounded-tr-sm" 
                        : "bg-white border border-gray-200 rounded-tl-sm"
                    }`}>
                      <div className={`flex items-center gap-2 mb-2 text-xs border-b pb-2 ${response.authorType === "Agent" ? "text-green-100 border-green-500/30" : "text-gray-500 border-gray-100"}`}>
                        <span className="font-bold">{response.author}</span>
                        <span>• {format(new Date(response.timestamp), "h:mm a")}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${response.authorType === "Agent" ? "text-green-50" : "text-gray-700"}`}>
                        {response.message}
                      </p>
                    </div>
                    {response.authorType === "Agent" && (
                      <div className="h-8 w-8 bg-green-100 rounded-full flex shrink-0 items-center justify-center text-green-700 font-bold text-xs mt-2 shadow-sm border border-green-200">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-5 bg-white border-t border-gray-200">
                <form onSubmit={handleSendResponse}>
                  <div className="relative group">
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={3}
                      className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm resize-none shadow-sm placeholder:text-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !responseMessage.trim()}
                      className="absolute bottom-3 right-3 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Sidebar Info */}
            <div className="w-full lg:w-80 bg-white p-6 space-y-8 overflow-y-auto border-t lg:border-t-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] z-10">
              
              {/* Status & Actions */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ticket Status</label>
                <div className="relative">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as SupportTicket["status"])}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 mb-0.5"></div>
                  </div>
                </div>
                
                {ticket.assignedTo !== currentUser.name && (
                  <button onClick={handleAssignToMe} className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg border border-blue-100 transition-all shadow-sm">
                    Assign to Me
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3 w-3" /> Ticket Details
                </h4>
                
                <div className="space-y-4 text-sm">
                  <div className="group">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Customer Name</span>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ticket.name}
                    </div>
                  </div>
                  <div className="group">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Email Address</span>
                    <a href={`mailto:${ticket.email}`} className="font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                      <Mail className="h-3.5 w-3.5 text-gray-400" /> {ticket.email}
                    </a>
                  </div>
                  {ticket.phone && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Phone Number</span>
                      <div className="font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" /> {ticket.phone}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Category</span>
                    <div className="font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block">
                      {ticket.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-white text-gray-600 text-xs font-medium rounded-md border border-gray-200 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}