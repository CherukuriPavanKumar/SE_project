import { Edit, Trash2, MapPin } from "lucide-react";
import type { Deal } from "@/lib/types";
import toast from "react-hot-toast";

interface DealTableProps {
  deals: Deal[];
  onViewDetails: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

export default function DealTable({ deals, onViewDetails, onDelete }: DealTableProps) {
  
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Qualified": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Proposal Sent": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Negotiation": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Closed Won": return "bg-green-50 text-green-700 border-green-200";
      case "Closed Lost": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Deal Info</th>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Financials</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Closing</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-base font-medium text-gray-900 mb-1">No deals found</p>
                    <p className="text-sm">Create a new deal to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onViewDetails(deal)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                        {deal.leadName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{deal.leadName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">ID: {deal.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={deal.propertyTitle}>{deal.propertyTitle}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3 flex-shrink-0" /> 
                      <span className="truncate">{deal.propertyAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{deal.dealValue}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Comm: {deal.commission}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStageBadge(deal.dealStage)}`}>
                      {deal.dealStage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${deal.probability > 75 ? 'text-green-600' : deal.probability > 40 ? 'text-orange-600' : 'text-red-600'}`}>
                          {deal.probability}% Prob.
                        </span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 text-gray-600 font-medium`}>
                        {deal.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-xs">
                    {deal.closingDate}
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toast("Edit coming soon")} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(deal.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete">
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