import { useState, useMemo } from "react";
import { X, User, Loader2, HelpCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addTicket } from "@/lib/redux/slices/supportSlice";
import { selectAllAgents } from "@/lib/redux/slices/agentSlice";
import type { SupportTicket } from "@/lib/types";
import { ticketCategories, ticketPriorities } from "@/lib/constants";
import toast from "react-hot-toast";

interface AddTicketModalProps {
  onClose: () => void;
}

export default function AddTicketModal({ onClose }: AddTicketModalProps) {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAllAgents);
  const activeAgents = useMemo(() => agents.filter(a => a.status === "Active"), [agents]);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "General" as SupportTicket["category"],
    priority: "Medium" as SupportTicket["priority"],
    assignedTo: "",
    tags: "",
    source: "Dashboard" as SupportTicket["source"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill required fields");
      return;
    }

    setIsLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 800));

    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const newTicket: SupportTicket = {
      id: `TKT${Date.now()}`,
      ticketNumber,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message,
      category: formData.category,
      priority: formData.priority,
      status: "New",
      assignedTo: formData.assignedTo || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      source: formData.source,
    };

    dispatch(addTicket(newTicket));
    toast.success(`Ticket ${ticketNumber} created!`);
    onClose();
    setIsLoading(false);
  };

  // Shared classes for high visibility inputs
  const inputClasses = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 placeholder:text-gray-400";
  const selectClasses = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create New Ticket</h3>
              <p className="text-xs text-gray-500 mt-0.5">Log a customer issue or inquiry</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 max-h-[75vh] overflow-y-auto space-y-8">
            
            {/* 1. Customer Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Customer Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className={inputClasses}
                    placeholder="Customer Name" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className={inputClasses}
                    placeholder="customer@example.com" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className={inputClasses}
                    placeholder="+91..." 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Source</label>
                  <select 
                    value={formData.source} 
                    onChange={e => setFormData({...formData, source: e.target.value as SupportTicket["source"]})} 
                    className={selectClasses}
                  >
                    <option value="Dashboard">Internal Dashboard</option>
                    <option value="Phone">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Chat">Live Chat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Ticket Details */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <HelpCircle className="h-3 w-3" /> Issue Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as SupportTicket["category"]})} 
                    className={selectClasses}
                  >
                    {ticketCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Priority *</label>
                  <select 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value as SupportTicket["priority"]})} 
                    className={selectClasses}
                  >
                    {ticketPriorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Assign To</label>
                  <select 
                    value={formData.assignedTo} 
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})} 
                    className={selectClasses}
                  >
                    <option value="">Unassigned</option>
                    {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Tags</label>
                  <input 
                    type="text" 
                    value={formData.tags} 
                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                    className={inputClasses}
                    placeholder="comma, separated, tags" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Subject *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})} 
                  className={inputClasses}
                  placeholder="Brief summary of the issue" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Description *</label>
                <textarea 
                  required 
                  rows={4} 
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  className={`${inputClasses} resize-none`}
                  placeholder="Detailed explanation..."
                ></textarea>
              </div>
            </div>

          </form>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}