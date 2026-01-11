import { useMemo } from "react";
import { 
  User, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  FileText, 
  MessageSquare, 
  ClipboardList 
} from "lucide-react";
import type { Deal } from "@/lib/types";

interface DealKanbanProps {
  deals: Deal[];
  onViewDetails: (deal: Deal) => void;
}

// ✅ FIX: Column definitions moved outside with Icons for the "Neat" look
const COLUMNS = [
  { 
    id: "Qualified", 
    label: "Qualified", 
    icon: ClipboardList,
    color: "text-blue-600", 
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  { 
    id: "Proposal Sent", 
    label: "Proposal Sent", 
    icon: FileText,
    color: "text-purple-600", 
    bg: "bg-purple-50",
    border: "border-purple-200"
  },
  { 
    id: "Negotiation", 
    label: "Negotiation", 
    icon: MessageSquare,
    color: "text-orange-600", 
    bg: "bg-orange-50",
    border: "border-orange-200"
  },
  { 
    id: "Closed Won", 
    label: "Closed Won", 
    icon: CheckCircle,
    color: "text-green-600", 
    bg: "bg-green-50",
    border: "border-green-200"
  },
  { 
    id: "Closed Lost", 
    label: "Closed Lost", 
    icon: XCircle,
    color: "text-red-600", 
    bg: "bg-red-50",
    border: "border-red-200"
  },
];

export default function DealKanban({ deals, onViewDetails }: DealKanbanProps) {
  
  const groupedDeals = useMemo(() => {
    const groups: Record<string, Deal[]> = {};
    COLUMNS.forEach(col => groups[col.id] = []);
    deals.forEach(deal => {
      if (groups[deal.dealStage]) {
        groups[deal.dealStage].push(deal);
      } else {
        if (!groups["Qualified"]) groups["Qualified"] = [];
        groups["Qualified"].push(deal); 
      }
    });
    return groups;
  }, [deals]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]">
      {COLUMNS.map((col) => (
        <div key={col.id} className="min-w-[300px] w-80 flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200">
          
          {/* Column Header (Matches Site Visits Style) */}
          <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${col.bg}`}>
                <col.icon className={`h-4 w-4 ${col.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{col.label}</h3>
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {groupedDeals[col.id]?.length || 0}
            </span>
          </div>

          {/* Cards Container */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {groupedDeals[col.id]?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg m-1">
                No deals
              </div>
            ) : (
              groupedDeals[col.id]?.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onViewDetails(deal)}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-300 relative"
                >
                  {/* Top Row: ID & Menu */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200">
                      {deal.id}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Main Info */}
                  <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1" title={deal.propertyTitle}>
                    {deal.propertyTitle}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{deal.leadName}</span>
                  </div>

                  {/* Footer: Value & Probability */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-gray-900 font-bold text-sm">
                        <span className="text-green-600">{deal.dealValue}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {deal.closingDate}
                      </div>
                    </div>

                    {/* Probability Bar */}
                    {deal.dealStage !== "Closed Won" && deal.dealStage !== "Closed Lost" && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            deal.probability > 75 ? 'bg-green-500' : 
                            deal.probability > 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}