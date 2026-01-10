import {
  X,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Briefcase,
  Calendar,
  Award,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import type { Agent } from "@/lib/types";
import toast from "react-hot-toast";

interface AgentDetailsModalProps {
  agent: Agent;
  onClose: () => void;
}

export default function AgentDetailsModal({ agent, onClose }: AgentDetailsModalProps) {
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

  const statusBadge = getStatusBadge(agent.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{agent.name}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {agent.id} • {agent.department}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadge(
                  agent.role
                )}`}
              >
                {agent.role}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusBadge.color}`}
              >
                {statusBadge.icon}
                {agent.status}
              </span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{agent.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-sm font-medium">Specialization</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {agent.specialization || "Not specified"}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Joined Date</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{agent.joinedDate}</p>
              </div>
            </div>

            {agent.licenseNumber && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xs text-yellow-700 font-medium">Broker License</p>
                    <p className="text-sm font-bold text-yellow-900">{agent.licenseNumber}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <Users className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Total Leads</p>
                  <p className="text-lg font-bold text-gray-900">{agent.totalLeads}</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Deals Closed</p>
                  <p className="text-lg font-bold text-green-600">{agent.totalDeals}</p>
                </div>
                <div className="text-center">
                  <DollarSign className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Total Revenue</p>
                  <p className="text-lg font-bold text-purple-600">{agent.totalRevenue}</p>
                </div>
                <div className="text-center">
                  <Award className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Commission</p>
                  <p className="text-lg font-bold text-orange-600">{agent.commission}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => toast("Edit feature coming soon")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
