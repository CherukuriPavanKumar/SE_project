import { X, User, Phone, MapPin, Calendar, Clock, Briefcase, Users, CheckCircle, XCircle } from "lucide-react";
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
      case "Scheduled": return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
      case "Completed": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Cancelled": return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  const getAgentRoleBadge = (agentName: string) => {
    const agent = agents.find((a) => a.name === agentName);
    // Default to 'Broker' styling if agent not found or role not specified
    const isEmployee = agent?.role === "Employee";

    return isEmployee ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
        <Briefcase className="h-3 w-3" />
        Employee
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
        <Users className="h-3 w-3" />
        Broker
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-gray-900">Site Visit Details</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadge(visit.status)}`}>
                  {visit.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">ID: {visit.id}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            
            {/* 1. Lead Info */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="h-3 w-3" /> Lead Information
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div>
                  <p className="text-xs text-blue-600 mb-0.5 font-medium">Name</p>
                  <p className="text-sm font-bold text-gray-900">{visit.leadName}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-0.5 font-medium">Phone</p>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-blue-400" />
                    <p className="text-sm font-medium text-gray-900">{visit.leadPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Property Info */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
              <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Property Details
              </h4>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">{visit.propertyTitle}</p>
                <p className="text-xs text-gray-600 flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-purple-400" />
                  {visit.propertyAddress}
                </p>
              </div>
            </div>

            {/* 3. Schedule Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Date</span>
                </div>
                <p className="text-lg font-bold text-gray-900 pl-6">{visit.visitDate}</p>
              </div>
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-orange-700 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900 pl-6">{visit.visitTime}</p>
              </div>
            </div>

            {/* 4. Agent Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {visit.assignedAgent.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Assigned Agent</p>
                <p className="text-sm font-bold text-gray-900">{visit.assignedAgent}</p>
              </div>
              <div>{getAgentRoleBadge(visit.assignedAgent)}</div>
            </div>

            {/* 5. Notes */}
            {visit.notes && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200 leading-relaxed italic">
                  &ldquo;{visit.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm"
            >
              Close
            </button>
            
            {visit.status === "Scheduled" && (
              <>
                <button
                  onClick={() => { onStatusChange(visit.id, "Cancelled"); onClose(); }}
                  className="px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={() => { onStatusChange(visit.id, "Completed"); onClose(); }}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" /> Mark Completed
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}