import { Mail, Phone, Edit, Trash2, Eye, Briefcase } from "lucide-react";
import type { Agent } from "@/lib/types";
import toast from "react-hot-toast";

interface AgentListViewProps {
  agents: Agent[];
  onViewDetails: (agent: Agent) => void;
  onDelete: (id: string) => void;
}

export default function AgentListView({ agents, onViewDetails, onDelete }: AgentListViewProps) {
  
  const getRoleBadge = (role: string) => {
    return role === "Employee" 
      ? "bg-blue-100 text-blue-700 border-blue-200" 
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">Agent Name</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Role & Dept</th>
              <th className="px-6 py-4">Performance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  No agents found.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onViewDetails(agent)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500">ID: {agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="h-3.5 w-3.5 text-gray-400" /> {agent.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Mail className="h-3.5 w-3.5 text-gray-400" /> {agent.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(agent.role)}`}>
                        {agent.role}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {agent.department}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-900">
                      {agent.totalDeals} Deals Closed
                    </div>
                    <div className="text-xs text-green-600 font-bold mt-0.5">
                      {agent.totalRevenue} Rev.
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onViewDetails(agent)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => toast("Edit coming soon")} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(agent.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}