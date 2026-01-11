import { useState, useMemo } from "react";
import { 
  X, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  IndianRupee, 
  Globe, 
  Tag, 
  UserCheck, 
  Calendar, 
  Clock 
} from "lucide-react";
import { leadSources, leadStages } from "@/lib/constants";
import type { Lead } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addLead as addLeadAction } from "@/lib/redux/slices/leadSlice";

import toast from "react-hot-toast";

interface AddLeadModalProps {
  onClose: () => void;
}

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads.items);
  const agents = useAppSelector((state) => state.agents.items);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    budget: "",
    stage: "New Lead",
    assignedTo: agents.find((a) => a.status === "Active")?.name || "",
    nextFollowUpDate: "",
    nextFollowUpTime: "",
    notes: "",
  });

  const activeAgents = useMemo(() => {
    return agents.filter((agent) => agent.status === "Active");
  }, [agents]);

  const formStages = leadStages.filter((s) => s !== "All Stages" && s !== "Closed");

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate network delay for UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextFollowUp =
        formData.nextFollowUpDate && formData.nextFollowUpTime
          ? `${formData.nextFollowUpDate} ${formData.nextFollowUpTime}`
          : formData.nextFollowUpDate || "";

      const newLead: Lead = {
        id: `L${String(leads.length + 1).padStart(3, "0")}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        budget: formData.budget,
        stage: formData.stage,
        assignedTo: formData.assignedTo,
        lastContact: "Just now",
        nextFollowUp: nextFollowUp,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      };

      dispatch(addLeadAction(newLead));
      onClose();
      toast.success("Lead added successfully!");
    } catch (error) {
      console.error("Failed to add lead:", error);
      toast.error("Failed to add lead");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Lead</h3>
              <p className="text-xs text-gray-500 mt-0.5">Enter lead details below to create a new opportunity</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddLead} className="px-6 py-6 space-y-8">
            
            {/* Group 1: Personal Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="e.g. Rahul Verma" 
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="tel" 
                      id="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="+91 98765 00000" 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="rahul@example.com" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Lead Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2 pt-2 border-t border-gray-100">
                <Tag className="h-3 w-3" /> Lead Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Budget */}
                <div className="space-y-1.5">
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">Budget Range</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      id="budget" 
                      value={formData.budget} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="e.g. 50L - 1Cr" 
                    />
                  </div>
                </div>

                {/* Source */}
                <div className="space-y-1.5">
                  <label htmlFor="source" className="block text-sm font-semibold text-gray-700">Source</label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select 
                      id="source" 
                      value={formData.source} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      {leadSources.filter((s) => s !== "All Sources").map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stage */}
                <div className="space-y-1.5">
                  <label htmlFor="stage" className="block text-sm font-semibold text-gray-700">Initial Stage</label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select 
                      id="stage" 
                      value={formData.stage} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      {formStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="space-y-1.5">
                  <label htmlFor="assignedTo" className="block text-sm font-semibold text-gray-700">Assigned Agent</label>
                  <div className="relative group">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select 
                      id="assignedTo" 
                      value={formData.assignedTo} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">-- Select Agent --</option>
                      {activeAgents.map((agent) => (
                        <option key={agent.id} value={agent.name}>{agent.name} ({agent.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Follow Up Date */}
                <div className="space-y-1.5">
                  <label htmlFor="nextFollowUpDate" className="block text-sm font-semibold text-gray-700">Next Follow-up</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="date" 
                      id="nextFollowUpDate" 
                      value={formData.nextFollowUpDate} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                    />
                  </div>
                </div>

                {/* Follow Up Time */}
                <div className="space-y-1.5">
                   <label htmlFor="nextFollowUpTime" className="block text-sm font-semibold text-gray-700">Time</label>
                   <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="time" 
                      id="nextFollowUpTime" 
                      value={formData.nextFollowUpTime} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                    />
                   </div>
                </div>
              </div>
            </div>

            {/* Group 3: Notes */}
            <div className="pt-2 border-t border-gray-100">
               <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
               <textarea 
                  id="notes" 
                  rows={3} 
                  value={formData.notes} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none" 
                  placeholder="Enter any specific requirements, preferences, or call notes here..."
                ></textarea>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={isLoading} 
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}