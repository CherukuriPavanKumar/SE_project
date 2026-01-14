import { useState, useMemo } from "react";
import { X, MapPin, Plus, User, Mail, Phone, DollarSign, Calendar, CheckCircle, Percent, Loader2, ChevronDown } from "lucide-react";
import { dealStages } from "@/lib/constants";
import type { Deal, Lead } from "@/lib/types";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addDeal as addDealAction } from "@/lib/redux/slices/dealSlice";
import { addLead as addLeadAction } from "@/lib/redux/slices/leadSlice";

import toast from "react-hot-toast";

interface AddDealModalProps {
  onClose: () => void;
}

export default function AddDealModal({ onClose }: AddDealModalProps) {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.items);
  const properties = useAppSelector((state) => state.properties.items);
  const leads = useAppSelector((state) => state.leads.items);
  const agents = useAppSelector((state) => state.agents.items);

  const [showCreateLead, setShowCreateLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    leadName: "",
    leadPhone: "",
    leadEmail: "",
    propertyTitle: "",
    propertyAddress: "",
    propertyPrice: "",
    dealValue: "",
    dealStage: "Qualified",
    probability: 30,
    assignedAgent: "",
    closingDate: "",
    notes: "",
  });

  const [newLeadData, setNewLeadData] = useState({
    name: "", phone: "", email: "", source: "Website", budget: "", 
    stage: "New Lead", assignedTo: "", nextFollowUp: "", notes: "",
  });

  const activeAgents = useMemo(() => agents.filter((a) => a.status === "Active"), [agents]);
  const availableProperties = useMemo(() => properties.filter((p) => ["Available", "Under Negotiation"].includes(p.status)), [properties]);

  const handleCreateNewLead = async () => {
    if (!newLeadData.name || !newLeadData.phone || !newLeadData.email || !newLeadData.assignedTo) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newLead: Lead = {
      id: `L${String(leads.length + 1).padStart(3, "0")}`,
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone,
      source: newLeadData.source,
      budget: newLeadData.budget,
      stage: newLeadData.stage,
      assignedTo: newLeadData.assignedTo,
      lastContact: new Date().toISOString().split("T")[0],
      nextFollowUp: newLeadData.nextFollowUp,
      notes: newLeadData.notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addLeadAction(newLead));

    setFormData({
      ...formData,
      leadName: newLeadData.name,
      leadPhone: newLeadData.phone,
      leadEmail: newLeadData.email,
      assignedAgent: newLeadData.assignedTo,
    });

    setNewLeadData({ name: "", phone: "", email: "", source: "Website", budget: "", stage: "New Lead", assignedTo: "", nextFollowUp: "", notes: "" });
    setShowCreateLead(false);
    setIsLoading(false);
    toast.success("New lead created!");
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leadName || !formData.propertyTitle || !formData.assignedAgent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const commission = (parseFloat(formData.dealValue.replace(/[^0-9.]/g, "")) * 0.02).toFixed(2);

    const newDeal: Deal = {
      id: `D${String(deals.length + 1).padStart(3, "0")}`,
      leadName: formData.leadName,
      leadPhone: formData.leadPhone,
      leadEmail: formData.leadEmail,
      propertyTitle: formData.propertyTitle,
      propertyAddress: formData.propertyAddress,
      propertyPrice: formData.propertyPrice,
      dealValue: formData.dealValue,
      dealStage: formData.dealStage,
      probability: formData.probability,
      assignedAgent: formData.assignedAgent,
      closingDate: formData.closingDate,
      commission: `₹${commission} Lakhs`,
      paymentStatus: "Pending",
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addDealAction(newDeal));
    onClose();
    setIsLoading(false);
    toast.success("Deal created successfully!");
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
  const selectClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create New Deal</h3>
              <p className="text-xs text-gray-500 mt-0.5">Start a new transaction pipeline</p>
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
                  <button onClick={() => setShowCreateLead(true)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    <Plus className="h-3 w-3" /> Create New Lead
                  </button>
                )}
              </div>

              {showCreateLead ? (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-blue-900">New Lead Details</h5>
                    <button onClick={() => setShowCreateLead(false)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={newLeadData.name} onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Full Name *" />
                    <input type="tel" value={newLeadData.phone} onChange={(e) => setNewLeadData({...newLeadData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Phone *" />
                    <input type="email" value={newLeadData.email} onChange={(e) => setNewLeadData({...newLeadData, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Email *" />
                    <select value={newLeadData.assignedTo} onChange={(e) => setNewLeadData({...newLeadData, assignedTo: e.target.value})} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                      <option value="">Select Agent *</option>
                      {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                  <button onClick={handleCreateNewLead} disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Lead"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <User className={iconClass} />
                    <select
                      value={formData.leadName}
                      onChange={(e) => {
                        const l = leads.find(lead => lead.name === e.target.value);
                        if (l) setFormData({ ...formData, leadName: l.name, leadPhone: l.phone, leadEmail: l.email, assignedAgent: l.assignedTo });
                      }}
                      className={selectClass}
                    >
                      <option value="">Select Existing Lead...</option>
                      {leads.map(l => <option key={l.id} value={l.name}>{l.name} - {l.phone}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  {formData.leadName && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center gap-4 text-xs text-blue-800 font-medium">
                      <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {formData.leadPhone}</span>
                      <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {formData.leadEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Property & Deal Terms */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Deal Terms
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 relative group">
                  <MapPin className={iconClass} />
                  <select
                    value={formData.propertyTitle}
                    onChange={(e) => {
                      const p = properties.find(prop => prop.title === e.target.value);
                      if (p) setFormData({ ...formData, propertyTitle: p.title, propertyAddress: p.location, propertyPrice: p.price, dealValue: p.price });
                    }}
                    className={selectClass}
                  >
                    <option value="">Select Property...</option>
                    {availableProperties.map(p => <option key={p.id} value={p.title}>{p.title} - {p.price}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative group">
                  <DollarSign className={iconClass} />
                  <input type="text" value={formData.dealValue} onChange={(e) => setFormData({...formData, dealValue: e.target.value})} className={inputClass} placeholder="Deal Value" />
                </div>

                <div className="relative group">
                  <CheckCircle className={iconClass} />
                  <select value={formData.dealStage} onChange={(e) => setFormData({...formData, dealStage: e.target.value})} className={selectClass}>
                    {dealStages.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative group">
                  <Percent className={iconClass} />
                  <input type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})} className={inputClass} placeholder="Probability %" />
                </div>

                <div className="relative group">
                  <Calendar className={iconClass} />
                  <input type="date" value={formData.closingDate} onChange={(e) => setFormData({...formData, closingDate: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-semibold shadow-sm">Cancel</button>
            <button onClick={handleAddDeal} disabled={isLoading || showCreateLead} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Deal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}