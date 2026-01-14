import { useMemo } from "react";
import { Clock, CheckCircle, XCircle, MapPin, Calendar, MoreHorizontal } from "lucide-react";
import type { SiteVisit } from "@/lib/types";

interface SiteVisitKanbanProps {
  visits: SiteVisit[];
  onViewDetails: (visit: SiteVisit) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function SiteVisitKanban({ visits, onViewDetails, onStatusChange }: SiteVisitKanbanProps) {
  // Group visits by status
  const groupedVisits = useMemo(() => {
    return {
      Scheduled: visits.filter((v) => v.status === "Scheduled"),
      Completed: visits.filter((v) => v.status === "Completed"),
      Cancelled: visits.filter((v) => v.status === "Cancelled"),
    };
  }, [visits]);

  const columns = [
    { id: "Scheduled", label: "Upcoming Visits", icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { id: "Completed", label: "Completed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    { id: "Cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]">
      {columns.map((col) => (
        <div key={col.id} className="min-w-[300px] w-80 flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden">
          
          {/* Column Header */}
          <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${col.bg}`}>
                <col.icon className={`h-4 w-4 ${col.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{col.label}</h3>
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold border border-gray-200">
              {groupedVisits[col.id as keyof typeof groupedVisits].length}
            </span>
          </div>

          {/* Cards Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 scroll-smooth">
            {groupedVisits[col.id as keyof typeof groupedVisits].length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg m-1">
                No visits
              </div>
            ) : (
              groupedVisits[col.id as keyof typeof groupedVisits].map((visit) => (
                <div
                  key={visit.id}
                  onClick={() => onViewDetails(visit)}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-300 relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                        {visit.id}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600 p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-gray-900 line-clamp-1 text-sm mb-1">{visit.leadName}</h4>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 flex-shrink-0 text-blue-500" />
                    <span className="truncate font-medium">{visit.propertyTitle}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>{visit.visitDate}</span>
                    </div>
                    <div className="flex -space-x-2">
                       <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm" title={visit.assignedAgent}>
                         {visit.assignedAgent.charAt(0)}
                       </div>
                    </div>
                  </div>

                  {/* Quick Actions (Hover) */}
                  {visit.status === "Scheduled" && (
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-white shadow-lg p-1 rounded-lg border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onStatusChange(visit.id, "Completed"); }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Complete"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onStatusChange(visit.id, "Cancelled"); }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Cancel"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}