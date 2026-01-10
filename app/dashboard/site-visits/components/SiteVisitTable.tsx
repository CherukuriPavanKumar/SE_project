import {
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Users,
} from "lucide-react";
import type { SiteVisit } from "@/lib/types";
import { useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";

interface SiteVisitTableProps {
  visits: SiteVisit[];
  onViewDetails: (visit: SiteVisit) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function SiteVisitTable({
  visits,
  onViewDetails,
  onDelete,
  onStatusChange,
}: SiteVisitTableProps) {
  const agents = useAppSelector((state) => state.agents.items);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-700",
        };
      case "Completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-100 text-green-700",
        };
      case "Cancelled":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getAgentRoleBadge = (agentName: string) => {
    const agent = agents.find((a) => a.name === agentName);
    if (!agent) return null;

    return agent.role === "Employee" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
        <Briefcase className="h-3 w-3" />
        Employee
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
        <Users className="h-3 w-3" />
        Broker
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No site visits found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              visits.map((visit) => {
                const statusBadge = getStatusBadge(visit.status);
                return (
                  <tr
                    key={visit.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewDetails(visit)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{visit.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {visit.leadName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{visit.leadName}</div>
                          <div className="text-sm text-gray-500">{visit.leadPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {visit.propertyTitle}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-xs">{visit.propertyAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{visit.visitDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{visit.visitTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}
                      >
                        {statusBadge.icon}
                        {visit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{visit.assignedAgent}</div>
                      <div className="mt-1">{getAgentRoleBadge(visit.assignedAgent)}</div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        {visit.status === "Scheduled" && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Mark Complete"
                              onClick={() => onStatusChange(visit.id, "Completed")}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Cancel"
                              onClick={() => onStatusChange(visit.id, "Cancelled")}
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
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
                          onClick={() => onDelete(visit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
