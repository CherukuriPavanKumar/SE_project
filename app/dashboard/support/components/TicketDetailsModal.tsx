import { useState } from "react";
import { X, User, Mail, Phone, Clock, Tag, Send} from "lucide-react";
import type { SupportTicket } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateTicketStatus, assignTicket, addResponse } from "@/lib/redux/slices/supportSlice";
import { selectUserProfile } from "@/lib/redux/slices/settingsSlice";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface TicketDetailsModalProps {
  ticket: SupportTicket;
  onClose: () => void;
}

export default function TicketDetailsModal({ ticket, onClose }: TicketDetailsModalProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUserProfile);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const getStatusColor = (status: string) => {
  //   const colors = {
  //     New: "bg-purple-100 text-purple-700",
  //     Open: "bg-blue-100 text-blue-700",
  //     "In Progress": "bg-orange-100 text-orange-700",
  //     Pending: "bg-yellow-100 text-yellow-700",
  //     Resolved: "bg-green-100 text-green-700",
  //     Closed: "bg-gray-100 text-gray-700",
  //   };
  //   return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  // };

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: "bg-gray-100 text-gray-700",
      Medium: "bg-blue-100 text-blue-700",
      High: "bg-orange-100 text-orange-700",
      Urgent: "bg-red-100 text-red-700",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const handleStatusChange = (newStatus: SupportTicket["status"]) => {
    dispatch(updateTicketStatus({ id: ticket.id, status: newStatus }));
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleAssignToMe = () => {
    dispatch(assignTicket({ id: ticket.id, assignedTo: currentUser.name }));
    toast.success("Ticket assigned to you");
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    setIsSubmitting(true);

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
    toast.success("Response sent successfully");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-600">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{ticket.ticketNumber}</h3>
                <p className="text-sm opacity-90 mt-1">{ticket.subject}</p>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{ticket.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${ticket.email}`} className="text-blue-600 hover:underline">
                        {ticket.email}
                      </a>
                    </div>
                    {ticket.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${ticket.phone}`} className="text-blue-600 hover:underline">
                          {ticket.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Message</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Conversation</h4>
                  <div className="space-y-4">
                    {ticket.responses.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No responses yet</p>
                    ) : (
                      ticket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`flex gap-3 ${
                            response.authorType === "Agent" ? "flex-row" : "flex-row-reverse"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                              response.authorType === "Agent"
                                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                : "bg-gradient-to-br from-green-500 to-teal-600"
                            }`}
                          >
                            {response.author.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className={`flex-1 ${response.authorType === "Customer" ? "text-right" : ""}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">{response.author}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(response.timestamp), "MMM d, yyyy h:mm a")}
                              </span>
                            </div>
                            <div
                              className={`inline-block p-3 rounded-lg ${
                                response.authorType === "Agent"
                                  ? "bg-blue-50 text-gray-900"
                                  : "bg-green-50 text-gray-900"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <form onSubmit={handleSendResponse} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Send Response</h4>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500 resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !responseMessage.trim()}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Ticket Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e.target.value as SupportTicket["status"])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                      >
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Priority</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Category</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.category}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Source</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.source}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Assignment</h4>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {ticket.assignedTo.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{ticket.assignedTo}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">Not assigned</p>
                  )}
                  {ticket.assignedTo !== currentUser.name && (
                    <button
                      onClick={handleAssignToMe}
                      className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Assign to Me
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Created: {format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Updated: {format(new Date(ticket.updatedAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                    {ticket.resolvedAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Resolved: {format(new Date(ticket.resolvedAt), "MMM d, yyyy h:mm a")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
