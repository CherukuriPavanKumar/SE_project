import { useState, useMemo } from "react";
import { X, MapPin, Plus, User, Mail, Phone, DollarSign, Calendar, FileText, CheckCircle, Percent, Loader2 } from "lucide-react";
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

  // New Lead Form Data
  const [newLeadData, setNewLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Website",
    budget: "",
    stage: "New Lead",
    assignedTo: "",
    nextFollowUp: "",
    nextFollowUpTime: "",
    notes: "",
  });

  // Filter active agents
  const activeAgents = useMemo(() => {
    return agents.filter((agent) => agent.status === "Active");
  }, [agents]);

  // Filter available properties
  const availableProperties = useMemo(() => {
    return properties.filter(
      (prop) => prop.status === "Available" || prop.status === "Under Negotiation"
    );
  }, [properties]);

  // Handle Create New Lead
  const handleCreateNewLead = async () => {
    if (!newLeadData.name || !newLeadData.phone || !newLeadData.email || !newLeadData.assignedTo) {
      toast.error("Please fill all required fields for the new lead");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
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

    // Auto-populate deal form with new lead data
    setFormData({
      ...formData,
      leadName: newLeadData.name,
      leadPhone: newLeadData.phone,
      leadEmail: newLeadData.email,
      assignedAgent: newLeadData.assignedTo,
    });

    // Reset new lead form
    setNewLeadData({
      name: "",
      phone: "",
      email: "",
      source: "Website",
      budget: "",
      stage: "New Lead",
      assignedTo: "",
      nextFollowUp: "",
      nextFollowUpTime: "",
      notes: "",
    });

    setShowCreateLead(false);
    setIsLoading(false);
    toast.success("New lead created successfully!");
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadName || !formData.propertyTitle || !formData.assignedAgent) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          {/* Header */}
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
                  <button
                    onClick={() => setShowCreateLead(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Create New Lead
                  </button>
                )}
              </div>

              {showCreateLead ? (
                // Create New Lead Form (Inline)
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-blue-900">New Lead Details</h5>
                    <button
                      onClick={() => setShowCreateLead(false)}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Full Name *</label>
                      <input
                        type="text"
                        value={newLeadData.name}
                        onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Phone *</label>
                      <input
                        type="tel"
                        value={newLeadData.phone}
                        onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Email *</label>
                      <input
                        type="email"
                        value={newLeadData.email}
                        onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Assigned To *</label>
                      <select
                        value={newLeadData.assignedTo}
                        onChange={(e) => setNewLeadData({ ...newLeadData, assignedTo: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">-- Select Agent --</option>
                        {activeAgents.map((agent) => (
                          <option key={agent.id} value={agent.name}>
                            {agent.name} ({agent.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateNewLead}
                    disabled={isLoading}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Use This Lead"}
                  </button>
                </div>
              ) : (
                // Select Existing Lead
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Select Lead *</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      <select
                        required
                        value={formData.leadName}
                        onChange={(e) => {
                          const selectedLead = leads.find((l) => l.name === e.target.value);
                          if (selectedLead) {
                            setFormData({
                              ...formData,
                              leadName: selectedLead.name,
                              leadPhone: selectedLead.phone,
                              leadEmail: selectedLead.email,
                              assignedAgent: selectedLead.assignedTo,
                            });
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="">-- Select a lead --</option>
                        {leads.map((lead) => (
                          <option key={lead.id} value={lead.name}>
                            {lead.name} - {lead.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formData.leadName && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Phone className="h-3 w-3" />
                        <span>{formData.leadPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800">
                        <Mail className="h-3 w-3" />
                        <span>{formData.leadEmail}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Property Selection */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Property Details
              </h4>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Select Property *</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  <select
                    required
                    value={formData.propertyTitle}
                    onChange={(e) => {
                      const selectedProperty = availableProperties.find((p) => p.title === e.target.value);
                      if (selectedProperty) {
                        setFormData({
                          ...formData,
                          propertyTitle: selectedProperty.title,
                          propertyAddress: selectedProperty.location,
                          propertyPrice: selectedProperty.price,
                          dealValue: selectedProperty.price, // Auto-fill deal value
                        });
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">-- Select a property --</option>
                    {availableProperties.map((property) => (
                      <option key={property.id} value={property.title}>
                        {property.title} - {property.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.propertyTitle && (
                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 text-sm">
                  <p className="font-medium text-purple-900">{formData.propertyAddress}</p>
                  <p className="text-purple-700 mt-1">Listed Price: {formData.propertyPrice}</p>
                </div>
              )}
            </div>

            {/* 3. Deal Specifics */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Deal Terms
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Deal Value *</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.dealValue}
                      onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      placeholder="₹85 Lakhs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Current Stage *</label>
                  <div className="relative group">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                      value={formData.dealStage}
                      onChange={(e) => setFormData({ ...formData, dealStage: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      {dealStages.filter((s) => s !== "All Stages" && s !== "Closed Won" && s !== "Closed Lost").map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Win Probability (%) *</label>
                  <div className="relative group">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Closing Date *</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="date"
                      required
                      value={formData.closingDate}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Assigned Agent *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                      required
                      value={formData.assignedAgent}
                      onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">-- Select an agent --</option>
                      {activeAgents.map((agent) => (
                        <option key={agent.id} value={agent.name}>
                          {agent.name} ({agent.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Notes</label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none"
                      placeholder="Add any specific deal notes or terms..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              onClick={handleAddDeal}
              disabled={showCreateLead || isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Deal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}