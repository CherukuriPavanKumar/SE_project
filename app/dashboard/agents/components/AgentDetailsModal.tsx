import { useState } from "react";
import { X, Mail, Phone, Briefcase, Calendar, Award, Users, TrendingUp, DollarSign, Save, Loader2, MapPin, Edit2 } from "lucide-react";
import type { Agent } from "@/lib/types";
import { agentDepartments, agentSpecializations } from "@/lib/constants";

// Redux
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateAgent as updateAgentState } from "@/lib/redux/slices/agentSlice";

// Server Action
import { updateAgent as updateAgentServer } from "../actions";

import toast from "react-hot-toast";

interface AgentDetailsModalProps {
  agent: Agent;
  onClose: () => void;
}

type AgentRole = "Employee" | "Broker";
type AgentStatus = "Active" | "Inactive";

export default function AgentDetailsModal({ agent, onClose }: AgentDetailsModalProps) {
  const dispatch = useAppDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    email: agent.email,
    phone: agent.phone,
    role: agent.role as AgentRole,
    department: agent.department,
    status: agent.status as AgentStatus,
    specialization: agent.specialization,
    licenseNumber: agent.licenseNumber || "",
    address: agent.address || ""
  });

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "text-green-700 bg-green-50 ring-green-600/20" 
      : "text-red-700 bg-red-50 ring-red-600/20";
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateAgentServer(agent.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      dispatch(updateAgentState({
        id: agent.id,
        data: {
          ...formData,
          licenseNumber: formData.role === "Broker" ? formData.licenseNumber : undefined
        }
      }));

      toast.success("Agent updated!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update agent");
    } finally {
      setIsLoading(false);
    }
  };

  const editInputClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 transition-all";
  const editSelectClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 cursor-pointer transition-all";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div className="flex items-center gap-5 w-full">
              <div className="h-16 w-16 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white">
                {agent.name.charAt(0)}
              </div>
              
              <div className="w-full">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pr-8">
                    <div className="col-span-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className={`${editInputClass} text-lg font-bold text-gray-900 h-10`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Status</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => setFormData({...formData, status: e.target.value as AgentStatus})} 
                            className={editSelectClass}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Role</label>
                        <select 
                            value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value as AgentRole})} 
                            className={editSelectClass}
                        >
                            <option value="Employee">Employee</option>
                            <option value="Broker">Broker</option>
                        </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-bold border border-gray-200">{agent.role}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  title="Edit Agent"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              )}
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 py-8 bg-gray-50/30 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="p-2 bg-blue-50 rounded-lg inline-block mb-2 text-blue-600"><Users className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Leads</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalLeads}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="p-2 bg-green-50 rounded-lg inline-block mb-2 text-green-600"><TrendingUp className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Deals</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalDeals}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="p-2 bg-purple-50 rounded-lg inline-block mb-2 text-purple-600"><DollarSign className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Revenue</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalRevenue}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="p-2 bg-orange-50 rounded-lg inline-block mb-2 text-orange-600"><Award className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Comm.</p>
                <p className="text-lg font-bold text-gray-900">{agent.commission}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">Contact Details</h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail className="h-4 w-4" /></div>
                    <div className="w-full">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Email</p>
                      {isEditing ? (
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={editInputClass}/>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{agent.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Phone className="h-4 w-4" /></div>
                    <div className="w-full">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Phone</p>
                      {isEditing ? (
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={editInputClass}/>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{agent.phone}</p>
                      )}
                    </div>
                  </div>
                  {(isEditing || agent.address) && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><MapPin className="h-4 w-4" /></div>
                        <div className="w-full">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Address</p>
                        {isEditing ? (
                            <textarea rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={`${editInputClass} resize-none`} placeholder="Enter address..."/>
                        ) : (
                            <p className="text-sm font-semibold text-gray-900">{agent.address}</p>
                        )}
                        </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Professional Info</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex items-center gap-2 w-1/3"><Briefcase className="h-4 w-4 text-blue-500"/> Department</span>
                    {isEditing ? (
                        <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className={`${editSelectClass} w-2/3`}>
                            {agentDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    ) : (
                        <span className="font-semibold text-gray-900">{agent.department}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex items-center gap-2 w-1/3"><Award className="h-4 w-4 text-blue-500"/> Specialization</span>
                    {isEditing ? (
                        <select value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className={`${editSelectClass} w-2/3`}>
                            {agentSpecializations.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    ) : (
                        <span className="font-semibold text-gray-900 truncate max-w-[150px]">{agent.specialization}</span>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <span className="text-gray-500 flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500"/> Joined</span>
                        <span className="font-semibold text-gray-900">{agent.joinedDate}</span>
                    </div>
                  )}
                  {(formData.role === "Broker" || agent.licenseNumber) && (
                    <div className="flex justify-between items-center text-sm pt-2">
                      <span className="text-gray-500 flex items-center gap-2 w-1/3"><Award className="h-4 w-4 text-yellow-500"/> License</span>
                      {isEditing ? (
                        <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className={`${editInputClass} w-2/3`} placeholder="License No."/>
                      ) : (
                        <span className="font-mono text-gray-900 bg-yellow-50 px-2 py-0.5 rounded text-xs border border-yellow-100">{agent.licenseNumber || "N/A"}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
            {isEditing ? (
                <>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ 
                          name: agent.name, 
                          email: agent.email, 
                          phone: agent.phone, 
                          role: agent.role as AgentRole, 
                          department: agent.department, 
                          status: agent.status as AgentStatus, 
                          specialization: agent.specialization, 
                          licenseNumber: agent.licenseNumber || "", 
                          address: agent.address || "" 
                        });
                      }} 
                      disabled={isLoading} 
                      className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave} 
                      disabled={isLoading} 
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-md transition-all flex items-center gap-2"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Save className="h-4 w-4" /> Save Changes</>}
                    </button>
                </>
            ) : (
                <button onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm">
                  Close
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}