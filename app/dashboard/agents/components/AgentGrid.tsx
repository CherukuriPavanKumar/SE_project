import { Mail, Phone, Building2, Calendar, Edit, Trash2, UserCog, CheckCircle, XCircle } from "lucide-react";
import type { Agent } from "@/lib/types";
import toast from "react-hot-toast";

interface AgentGridProps {
  agents: Agent[];
  onViewDetails: (agent: Agent) => void;
  onDelete: (id: string) => void;
}

export default function AgentGrid({ agents, onViewDetails, onDelete }: AgentGridProps) {
  const getRoleBadge = (role: string) => {
    return role === "Employee"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  };

  const getStatusBadge = (status: string) => {
    return status === "Active"
      ? { icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-700" }
      : { icon: <XCircle className="h-4 w-4" />, color: "bg-red-100 text-red-700" };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.length === 0 ? (
        <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
          <UserCog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No agents found. Try adjusting your filters.</p>
        </div>
      ) : (
        agents.map((agent) => {
          const statusBadge = getStatusBadge(agent.status);
          return (
            <div
              key={agent.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewDetails(agent)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <p className="text-sm text-white/80 mt-1">{agent.id}</p>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                      agent.role
                    )}`}
                  >
                    {agent.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.color}`}
                  >
                    {statusBadge.icon}
                    {agent.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{agent.department}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Leads</p>
                    <p className="text-sm font-bold text-gray-900">{agent.totalLeads}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-xs text-gray-600">Deals</p>
                    <p className="text-sm font-bold text-green-600">{agent.totalDeals}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-sm font-bold text-blue-600">{agent.totalRevenue}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {agent.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-orange-600 hover:text-orange-900 transition-colors"
                      title="Edit"
                      onClick={() => toast("Edit feature coming soon")}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                      onClick={() => onDelete(agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
