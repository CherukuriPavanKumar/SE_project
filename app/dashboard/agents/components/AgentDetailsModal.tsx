import { X, Mail, Phone, Briefcase, Calendar, Award, Users, TrendingUp, DollarSign } from "lucide-react";
import type { Agent } from "@/lib/types";
import toast from "react-hot-toast";

interface AgentDetailsModalProps {
  agent: Agent;
  onClose: () => void;
}

export default function AgentDetailsModal({ agent, onClose }: AgentDetailsModalProps) {
  
  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "text-green-700 bg-green-50 ring-green-600/20" 
      : "text-red-700 bg-red-50 ring-red-600/20";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white">
                {agent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-bold border border-gray-200">{agent.role}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-8 bg-gray-50/30 space-y-8">
            
            {/* Top Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-blue-50 rounded-lg inline-block mb-2 text-blue-600"><Users className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Leads</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalLeads}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-green-50 rounded-lg inline-block mb-2 text-green-600"><TrendingUp className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Deals</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalDeals}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-purple-50 rounded-lg inline-block mb-2 text-purple-600"><DollarSign className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Revenue</p>
                <p className="text-lg font-bold text-gray-900">{agent.totalRevenue}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-orange-50 rounded-lg inline-block mb-2 text-orange-600"><Award className="h-5 w-5" /></div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Comm.</p>
                <p className="text-lg font-bold text-gray-900">{agent.commission}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Contact Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  Contact Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Phone className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{agent.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Professional Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Professional Info</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-500"/> Department</span>
                    <span className="font-semibold text-gray-900">{agent.department}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500"/> Joined</span>
                    <span className="font-semibold text-gray-900">{agent.joinedDate}</span>
                  </div>
                  {agent.licenseNumber && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-2"><Award className="h-4 w-4 text-yellow-500"/> License</span>
                      <span className="font-mono text-gray-900 bg-yellow-50 px-2 py-0.5 rounded text-xs border border-yellow-100">{agent.licenseNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm">Close</button>
            <button onClick={() => toast("Edit coming soon")} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-md transition-all flex items-center gap-2">Edit Agent</button>
          </div>
        </div>
      </div>
    </div>
  );
}