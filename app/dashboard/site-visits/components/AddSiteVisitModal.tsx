import { useState, useMemo } from "react";
import { X, MapPin, User, Plus, UserCheck } from "lucide-react";
import { leadSources, leadStages } from "@/lib/constants";
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
  
  // ✅ ALL DATA FROM REDUX
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items);
  const leads = useAppSelector((state) => state.leads.items);

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [showCreateLead, setShowCreateLead] = useState(false);

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

  // Filter active leads
  const activeLeads = useMemo(() => {
    return leads.filter((lead) => !["Closed", "Discarded"].includes(lead.stage));
  }, [leads]);

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
      budget: newLeadData.budget || "Not Specified",
      stage: newLeadData.stage,
      assignedTo: newLeadData.assignedTo,
      lastContact: new Date().toISOString().split("T")[0],
      nextFollowUp: newLeadData.nextFollowUp || new Date().toISOString().split("T")[0],
      notes: newLeadData.notes || `Created during site visit scheduling`,
      createdAt: new Date().toISOString(),
    };

    // ✅ Dispatch to Redux
    dispatch(addLeadAction(newLead));

    // Auto-populate visit form
    setFormData({
      ...formData,
      leadName: newLeadData.name,
      leadPhone: newLeadData.phone,
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
      notes: "",
    });

    setShowCreateLead(false);
    toast.success("New lead created successfully!");
  };

  // Handle Add Site Visit
  const handleAddSiteVisit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadName || !formData.propertyTitle || !formData.assignedAgent) {
      toast.error("Please fill all required fields");
      return;
    }

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

    // ✅ Dispatch to Redux
    dispatch(addSiteVisitAction(newVisit));

    onClose();
    toast.success("Site visit scheduled successfully!");
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
            <h3 className="text-lg font-semibold text-gray-900">Schedule Site Visit</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Lead Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Lead Information
                  </h4>
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
                          Next Follow-up Date
                        </label>
                        <input
                          type="date"
                          value={newLeadData.nextFollowUp}
                          onChange={(e) => setNewLeadData({ ...newLeadData, nextFollowUp: e.target.value })}
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Lead
                      </label>
                      <select
                        value={selectedLeadId}
                        onChange={(e) => {
                          setSelectedLeadId(e.target.value);
                          const selectedLead = leads.find((l) => l.id === e.target.value);
                          if (selectedLead) {
                            setFormData({
                              ...formData,
                              leadName: selectedLead.name,
                              leadPhone: selectedLead.phone,
                              assignedAgent: selectedLead.assignedTo,
                            });
                          } else {
                            setFormData({
                              ...formData,
                              leadName: "",
                              leadPhone: "",
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                      >
                        <option value="">-- Select existing lead --</option>
                        {activeLeads.map((lead) => (
                          <option key={lead.id} value={lead.id} className="text-gray-900">
                            {lead.name} - {lead.phone} ({lead.stage})
                          </option>
                        ))}
                      </select>

                      {selectedLeadId && (
                        <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Existing lead selected
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lead Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.leadName}
                          onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                          disabled={selectedLeadId !== ""}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500 ${
                            selectedLeadId !== "" ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
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
                          value={formData.leadPhone}
                          onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                          disabled={selectedLeadId !== ""}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500 ${
                            selectedLeadId !== "" ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Selection */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Property Details
                </h4>

                <div className="space-y-4">
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
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Visit Schedule */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Visit Schedule</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visit Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visit Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.visitTime}
                      onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
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
                      placeholder="Add visit notes..."
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
                handleAddSiteVisit(e);
              }}
              disabled={showCreateLead}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Schedule Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
