import { useState } from "react";
import { X, User, Mail, Phone, Briefcase, Loader2, MapPin } from "lucide-react";
import type { Agent } from "@/lib/types";
import { agentDepartments, agentSpecializations } from "@/lib/constants";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addAgent as addAgentAction } from "@/lib/redux/slices/agentSlice";

import toast from "react-hot-toast";

interface AddAgentModalProps {
  onClose: () => void;
}

// Define specific types for dropdowns to avoid 'any'
type AgentRole = "Employee" | "Broker";
type AgentStatus = "Active" | "Inactive";

export default function AddAgentModal({ onClose }: AddAgentModalProps) {
  const dispatch = useAppDispatch();
  const agents = useAppSelector((state) => state.agents.items);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Employee" as AgentRole,
    department: "Sales",
    status: "Active" as AgentStatus,
    specialization: "Residential Properties",
    licenseNumber: "",
    address: "",
  });

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAgent: Agent = {
      id: `AG${String(agents.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      joinedDate: new Date().toISOString().split("T")[0],
      totalLeads: 0,
      totalDeals: 0,
      totalRevenue: "₹0",
      commission: "₹0",
      specialization: formData.specialization,
      address: formData.address || undefined,
      licenseNumber: formData.role === "Broker" ? formData.licenseNumber : undefined,
    };

    dispatch(addAgentAction(newAgent));
    onClose();
    setIsLoading(false);
    toast.success("Agent added successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Agent</h3>
              <p className="text-xs text-gray-500 mt-0.5">Onboard a new team member</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddAgent} className="px-6 py-6 max-h-[75vh] overflow-y-auto space-y-8">
            
            {/* 1. Personal Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="John Doe" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                      placeholder="+91 XXXXX XXXXX" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Role & Dept */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Briefcase className="h-3 w-3" /> Role & Department
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Role</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value as AgentRole})} 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer appearance-none"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Department</label>
                  <select 
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})} 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer appearance-none"
                  >
                    {agentDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Specialization</label>
                  <select 
                    value={formData.specialization} 
                    onChange={e => setFormData({...formData, specialization: e.target.value})} 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer appearance-none"
                  >
                    {agentSpecializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as AgentStatus})} 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formData.role === "Broker" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-sm font-semibold text-gray-700">Broker License Number</label>
                  <input 
                    type="text" 
                    value={formData.licenseNumber} 
                    onChange={e => setFormData({...formData, licenseNumber: e.target.value})} 
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all shadow-sm" 
                    placeholder="BRK-2024-XXXX" 
                  />
                </div>
              )}
            </div>

            {/* 3. Address */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-3 w-3"/> Address
              </label>
              <textarea 
                rows={2} 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                placeholder="Enter full address..."
              ></textarea>
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
              onClick={handleAddAgent} 
              disabled={isLoading} 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}