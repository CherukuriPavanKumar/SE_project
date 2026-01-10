import { X, User, Phone, MapPin, Calendar, Clock, Briefcase, Users } from "lucide-react";
import type { SiteVisit } from "@/lib/types";
import { useAppSelector } from "@/lib/redux/hooks";

interface SiteVisitDetailsModalProps {
  visit: SiteVisit;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function SiteVisitDetailsModal({
  visit,
  onClose,
  onStatusChange,
}: SiteVisitDetailsModalProps) {
  const agents = useAppSelector((state) => state.agents.items);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Site Visit Details</h3>
              <p className="text-sm text-gray-500 mt-1">{visit.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <span
                className={`px-4 py-1.5 inline-flex items-center gap-2 text-sm font-semibold rounded-full ${getStatusBadge(
                  visit.status
                )}`}
              >
                {visit.status}
              </span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Lead Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{visit.leadName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{visit.leadPhone}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Property Details</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{visit.propertyTitle}</p>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{visit.propertyAddress}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Visit Date</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{visit.visitDate}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Visit Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{visit.visitTime}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Assigned Agent</h4>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {visit.assignedAgent
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{visit.assignedAgent}</p>
                  <div className="mt-1">{getAgentRoleBadge(visit.assignedAgent)}</div>
                </div>
              </div>
            </div>

            {visit.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{visit.notes}</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {visit.status === "Scheduled" && (
              <button
                onClick={() => {
                  onStatusChange(visit.id, "Completed");
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
