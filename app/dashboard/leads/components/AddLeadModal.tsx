"use client";

import { useState, useMemo } from "react";
import { 
  X, Loader2, User, Mail, Phone, IndianRupee, Globe, Tag, UserCheck, Calendar, Clock, Home, Check
} from "lucide-react";
import { leadSources, leadStages } from "@/lib/constants";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addLead as addLeadReduxAction } from "@/lib/redux/slices/leadSlice";
import { addLead } from "../actions"; // Import the Server Action
import toast from "react-hot-toast";

interface AddLeadModalProps {
  onClose: () => void;
}

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const dispatch = useAppDispatch();
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items);

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

  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const activeAgents = useMemo(() => agents.filter((a) => a.status === "Active"), [agents]);
  const availableProperties = useMemo(() => properties.filter((p) => p.status === "Available" || p.status === "Under Negotiation"), [properties]);
  const formStages = leadStages.filter((s) => s !== "All Stages" && s !== "Closed");

  const toggleProperty = (title: string) => {
    setSelectedProperties(prev => prev.includes(title) ? prev.filter(p => p !== title) : [...prev, title]);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const nextFollowUp = formData.nextFollowUpDate && formData.nextFollowUpTime
          ? `${formData.nextFollowUpDate} ${formData.nextFollowUpTime}`
          : undefined;

      const leadPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        budget: formData.budget,
        stage: formData.stage,
        assignedTo: formData.assignedTo,
        propertyInterest: selectedProperties,
        nextFollowUp: nextFollowUp,
        notes: formData.notes,
      };

      // Call Server Action
      const result = await addLead(leadPayload);

      if (result.error) {
        toast.error(`Error: ${result.error}`);
        return;
      }

      if (result.success && result.newLead) {
        dispatch(addLeadReduxAction(result.newLead));
        toast.success("Lead added successfully!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
  const selectClasses = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-visible shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Lead</h3>
              <p className="text-xs text-gray-500 mt-0.5">Enter details to create a new opportunity</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddLead} className="px-6 py-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" id="name" required value={formData.name} onChange={handleChange} className={inputClasses} placeholder="e.g. Rahul Verma" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" id="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="+91..." />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" id="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="rahul@example.com" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Home className="h-3 w-3" /> Interest & Budget
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5 relative">
                  <label className="block text-sm font-semibold text-gray-700">Interested Properties</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <span className={`block truncate ${selectedProperties.length === 0 ? "text-gray-400" : "text-gray-900"}`}>
                          {selectedProperties.length === 0 ? "Select properties..." : `${selectedProperties.length} selected`}
                        </span>
                      </div>
                    </button>
                    {isPropertyDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {availableProperties.map((prop) => (
                          <div key={prop.id} onClick={() => toggleProperty(prop.title)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedProperties.includes(prop.title) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                              {selectedProperties.includes(prop.title) && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <p className="text-sm font-medium text-gray-900">{prop.title}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedProperties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProperties.map(prop => (
                        <span key={prop} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                          {prop}
                          <button type="button" onClick={() => toggleProperty(prop)} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">Budget Range</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" id="budget" value={formData.budget} onChange={handleChange} className={inputClasses} placeholder="e.g. 50L - 1Cr" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="source" className="block text-sm font-semibold text-gray-700">Source</label>
                  <div className="relative group">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select id="source" value={formData.source} onChange={handleChange} className={selectClasses}>
                      {leadSources.filter((s) => s !== "All Sources").map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Tag className="h-3 w-3" /> Workflow
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="stage" className="block text-sm font-semibold text-gray-700">Stage</label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select id="stage" value={formData.stage} onChange={handleChange} className={selectClasses}>
                      {formStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="assignedTo" className="block text-sm font-semibold text-gray-700">Assigned Agent</label>
                  <div className="relative group">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select id="assignedTo" value={formData.assignedTo} onChange={handleChange} className={selectClasses}>
                      <option value="">-- Select Agent --</option>
                      {activeAgents.map((agent) => (
                        <option key={agent.id} value={agent.name}>{agent.name} ({agent.role})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nextFollowUpDate" className="block text-sm font-semibold text-gray-700">Next Follow-up</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="date" id="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleChange} className={inputClasses} />
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label htmlFor="nextFollowUpTime" className="block text-sm font-semibold text-gray-700">Time</label>
                   <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="time" id="nextFollowUpTime" value={formData.nextFollowUpTime} onChange={handleChange} className={inputClasses} />
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
               <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
               <textarea id="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none" placeholder="Enter notes..."></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}