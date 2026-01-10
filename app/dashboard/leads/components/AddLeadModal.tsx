import { useState, useMemo } from "react";
import { X } from "lucide-react";
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

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();

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
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleAddLead} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  {leadSources.filter((s) => s !== "All Sources").map((source) => (
                    <option key={source} value={source} className="text-gray-900">
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., ₹45-55L"
                />
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  id="stage"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  {formStages.map((stage) => (
                    <option key={stage} value={stage} className="text-gray-900">
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="">-- Select Agent --</option>
                  {activeAgents.map((agent) => (
                    <option key={agent.id} value={agent.name} className="text-gray-900">
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="nextFollowUpDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  id="nextFollowUpDate"
                  value={formData.nextFollowUpDate}
                  onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="nextFollowUpTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Next Follow-up Time
                </label>
                <input
                  type="time"
                  id="nextFollowUpTime"
                  value={formData.nextFollowUpTime}
                  onChange={(e) => setFormData({ ...formData, nextFollowUpTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
