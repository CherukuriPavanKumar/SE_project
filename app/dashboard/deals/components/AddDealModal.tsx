import { useState, useMemo } from "react";
import { X, MapPin, Plus } from "lucide-react";
import { dealStages, leadSources, leadStages } from "@/lib/constants";
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
  const handleCreateNewLead = () => {
    if (!newLeadData.name || !newLeadData.phone || !newLeadData.email || !newLeadData.assignedTo) {
      toast.error("Please fill all required fields for the new lead");
      return;
    }

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
    toast.success("New lead created successfully!");
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadName || !formData.propertyTitle || !formData.assignedAgent) {
      toast.error("Please fill all required fields");
      return;
    }

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
    toast.success("Deal created successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Create New Deal</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Lead Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Lead Information</h4>
                  {!showCreateLead && (
                    <button
                      onClick={() => setShowCreateLead(true)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Lead
                    </button>
                  )}
                </div>

                {showCreateLead ? (
                  // Create New Lead Form
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold text-blue-900">New Lead Details</h5>
                      <button
                        onClick={() => setShowCreateLead(false)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newLeadData.name}
                          onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newLeadData.phone}
                          onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={newLeadData.email}
                          onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Source *
                        </label>
                        <select
                          value={newLeadData.source}
                          onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        >
                          {leadSources.filter((s) => s !== "All Sources").map((source) => (
                            <option key={source} value={source}>
                              {source}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Budget Range
                        </label>
                        <input
                          type="text"
                          value={newLeadData.budget}
                          onChange={(e) => setNewLeadData({ ...newLeadData, budget: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="e.g., ₹45-55L"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stage *
                        </label>
                        <select
                          value={newLeadData.stage}
                          onChange={(e) => setNewLeadData({ ...newLeadData, stage: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        >
                          {leadStages.filter((s) => s !== "All Stages").map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigned To *
                        </label>
                        <select
                          required
                          value={newLeadData.assignedTo}
                          onChange={(e) => setNewLeadData({ ...newLeadData, assignedTo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        >
                          <option value="">-- Select Agent --</option>
                          {activeAgents.map((agent) => (
                            <option key={agent.id} value={agent.name}>
                              {agent.name} ({agent.role})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Next Follow-up Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={newLeadData.nextFollowUp}
                          onChange={(e) => setNewLeadData({ ...newLeadData, nextFollowUp: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Next Follow-up Time
                        </label>
                        <input
                          type="time"
                          value={newLeadData.nextFollowUpTime}
                          onChange={(e) => setNewLeadData({ ...newLeadData, nextFollowUpTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          rows={2}
                          value={newLeadData.notes}
                          onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="Add any additional notes..."
                        ></textarea>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateNewLead}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Lead & Continue
                    </button>
                  </div>
                ) : (
                  // Select Existing Lead
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Lead *
                      </label>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                      >
                        <option value="">-- Select a lead --</option>
                        {leads.map((lead) => (
                          <option key={lead.id} value={lead.name} className="text-gray-900">
                            {lead.name} - {lead.phone}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.leadName && (
                      <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Phone:</span>
                            <span className="text-blue-900 ml-2">{formData.leadPhone}</span>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Email:</span>
                            <span className="text-blue-900 ml-2">{formData.leadEmail}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Property Selection */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Property Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Property *
                    </label>
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
                            dealValue: selectedProperty.price,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    >
                      <option value="">-- Select a property --</option>
                      {availableProperties.map((property) => (
                        <option key={property.id} value={property.title} className="text-gray-900">
                          {property.title} - {property.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.propertyTitle && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-900">Property Address:</p>
                          <p className="text-purple-700">{formData.propertyAddress}</p>
                          <p className="font-medium text-purple-900 mt-2">Listed Price: {formData.propertyPrice}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Deal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Value *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.dealValue}
                      onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                      placeholder="₹85 Lakhs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Stage *
                    </label>
                    <select
                      value={formData.dealStage}
                      onChange={(e) => setFormData({ ...formData, dealStage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    >
                      {dealStages.filter((s) => s !== "All Stages" && s !== "Closed Won" && s !== "Closed Lost").map((stage) => (
                        <option key={stage} value={stage} className="text-gray-900">
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Probability (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Closing Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.closingDate}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Agent *
                    </label>
                    <select
                      required
                      value={formData.assignedAgent}
                      onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    >
                      <option value="">-- Select an agent --</option>
                      {activeAgents.map((agent) => (
                        <option key={agent.id} value={agent.name} className="text-gray-900">
                          {agent.name} ({agent.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                      placeholder="Add deal notes..."
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
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddDeal(e);
              }}
              disabled={showCreateLead}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
