import { useState, useMemo } from "react";
import { X, MapPin, User, Plus, UserCheck, Calendar, Clock, Loader2 } from "lucide-react";
// import { leadSources, leadStages } from "@/lib/constants";
import type { SiteVisit, Lead } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addSiteVisit as addSiteVisitAction } from "@/lib/redux/slices/siteVisitSlice";
import { addLead as addLeadAction } from "@/lib/redux/slices/leadSlice";

import toast from "react-hot-toast";

interface AddSiteVisitModalProps {
  onClose: () => void;
}

export default function AddSiteVisitModal({ onClose }: AddSiteVisitModalProps) {
  const dispatch = useAppDispatch();
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items);
  const leads = useAppSelector((state) => state.leads.items);

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    leadName: "",
    leadPhone: "",
    propertyTitle: "",
    propertyAddress: "",
    visitDate: "",
    visitTime: "",
    assignedAgent: "",
    notes: "",
  });

  const [newLeadData, setNewLeadData] = useState({
    name: "", phone: "", email: "", source: "Website", budget: "", 
    stage: "New Lead", assignedTo: "", nextFollowUp: "", notes: "",
  });

  const activeAgents = useMemo(() => agents.filter((a) => a.status === "Active"), [agents]);
  const activeLeads = useMemo(() => leads.filter((l) => !["Closed", "Discarded"].includes(l.stage)), [leads]);
  const availableProperties = useMemo(() => properties.filter((p) => p.status === "Available" || p.status === "Under Negotiation"), [properties]);

  const handleCreateLead = async () => {
    if (!newLeadData.name || !newLeadData.phone || !newLeadData.assignedTo) {
      toast.error("Please fill required lead details");
      return;
    }
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500)); // Simulate API

    const newLead: Lead = {
      id: `L${String(leads.length + 1).padStart(3, "0")}`,
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone,
      source: newLeadData.source,
      budget: newLeadData.budget || "Not Specified",
      stage: newLeadData.stage,
      assignedTo: newLeadData.assignedTo,
      lastContact: "Just now",
      nextFollowUp: newLeadData.nextFollowUp || new Date().toISOString().split("T")[0],
      notes: newLeadData.notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addLeadAction(newLead));
    
    // Auto-fill visit form
    setFormData(prev => ({
      ...prev,
      leadName: newLeadData.name,
      leadPhone: newLeadData.phone,
      assignedAgent: newLeadData.assignedTo
    }));
    
    setShowCreateLead(false);
    setIsLoading(false);
    toast.success("Lead created & selected!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leadName || !formData.propertyTitle || !formData.assignedAgent) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const newVisit: SiteVisit = {
      id: `SV${String(siteVisits.length + 1).padStart(3, "0")}`,
      leadName: formData.leadName,
      leadPhone: formData.leadPhone,
      propertyTitle: formData.propertyTitle,
      propertyAddress: formData.propertyAddress,
      visitDate: formData.visitDate,
      visitTime: formData.visitTime,
      status: "Scheduled",
      assignedAgent: formData.assignedAgent,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addSiteVisitAction(newVisit));
    onClose();
    toast.success("Site visit scheduled successfully!");
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Schedule Site Visit</h3>
              <p className="text-xs text-gray-500 mt-0.5">Plan a property tour for a lead</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 max-h-[75vh] overflow-y-auto space-y-8">
            
            {/* 1. Lead Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                  <User className="h-3 w-3" /> Lead Information
                </h4>
                {!showCreateLead && (
                  <button onClick={() => setShowCreateLead(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Create New Lead
                  </button>
                )}
              </div>

              {showCreateLead ? (
                // Inline Create Lead Form
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-blue-800">New Lead Details</span>
                    <button onClick={() => setShowCreateLead(false)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Full Name</label>
                      <input type="text" value={newLeadData.name} onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="Name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Phone</label>
                      <input type="tel" value={newLeadData.phone} onChange={(e) => setNewLeadData({...newLeadData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="Phone" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Email</label>
                      <input type="email" value={newLeadData.email} onChange={(e) => setNewLeadData({...newLeadData, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="Email" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Assigned Agent</label>
                      <select value={newLeadData.assignedTo} onChange={(e) => setNewLeadData({...newLeadData, assignedTo: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm">
                        <option value="">Select Agent</option>
                        {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={handleCreateLead} disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Save & Use This Lead"}
                  </button>
                </div>
              ) : (
                // Select Existing
                <div className="relative group">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <select
                    value={selectedLeadId}
                    onChange={(e) => {
                      setSelectedLeadId(e.target.value);
                      const l = leads.find(lead => lead.id === e.target.value);
                      if (l) setFormData({ ...formData, leadName: l.name, leadPhone: l.phone, assignedAgent: l.assignedTo });
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select an existing lead...</option>
                    {activeLeads.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.stage})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 2. Property & Schedule */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2 pt-4 border-t border-gray-100">
                <MapPin className="h-3 w-3" /> Visit Details
              </h4>
              
              {/* Property */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Select Property *</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <select
                    value={formData.propertyTitle}
                    onChange={(e) => {
                      const p = properties.find(prop => prop.title === e.target.value);
                      if (p) setFormData({ ...formData, propertyTitle: p.title, propertyAddress: p.location });
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Choose property...</option>
                    {availableProperties.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Date *</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input type="date" value={formData.visitDate} onChange={(e) => setFormData({...formData, visitDate: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Time *</label>
                  <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input type="time" value={formData.visitTime} onChange={(e) => setFormData({...formData, visitTime: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Agent (if different) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Conducting Agent *</label>
                <div className="relative group">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <select
                    value={formData.assignedAgent}
                    onChange={(e) => setFormData({...formData, assignedAgent: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Assign to...</option>
                    {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Visit Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none"
                  placeholder="Any specific instructions..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={isLoading || showCreateLead} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Schedule Visit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}