import { Edit, Trash2, MapPin, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import type { SiteVisit } from "@/lib/types";
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
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed": return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Lead Details</th>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {visits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-base font-medium text-gray-900 mb-1">No site visits found</p>
                    <p className="text-sm">Try scheduling a new visit.</p>
                  </div>
                </td>
              </tr>
            ) : (
              visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onViewDetails(visit)}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{visit.leadName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{visit.leadPhone}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={visit.propertyTitle}>{visit.propertyTitle}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
                      <MapPin className="h-3 w-3" /> <span>{visit.propertyAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" /> {visit.visitDate}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Clock className="h-3 w-3 text-gray-400" /> {visit.visitTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusStyle(visit.status)}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {visit.assignedAgent}
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      {visit.status === "Scheduled" && (
                        <>
                          <button 
                            onClick={() => onStatusChange(visit.id, "Completed")} 
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100" 
                            title="Complete"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onStatusChange(visit.id, "Cancelled")} 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => toast("Edit feature coming soon")} 
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(visit.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                        title="Delete"
                      >
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