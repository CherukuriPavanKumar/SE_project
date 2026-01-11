import { Eye, Phone, Trash2 } from "lucide-react";
// import { Edit } from "lucide-react";

import type { Lead } from "@/lib/types";
import toast from "react-hot-toast";

// ⚡ OPTIMIZATION: Define color map outside component for O(1) lookup
const STAGE_STYLES: Record<string, string> = {
  "New Lead": "bg-blue-50 text-blue-700 border-blue-200",
  "Contacted": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Site Visit Scheduled": "bg-orange-50 text-orange-700 border-orange-200",
  "Negotiation": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Closed": "bg-green-50 text-green-700 border-green-200",
  "Discarded": "bg-red-50 text-red-700 border-red-200",
};

interface LeadTableProps {
  leads: Lead[];
  onStageClick: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadTable({ leads, onStageClick, onDelete }: LeadTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Lead Details</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Stage</th>
              <th className="px-6 py-4">Assigned Agent</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900 mb-1">No leads found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                  {/* Lead Name & Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500">ID: {lead.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-900 font-medium">{lead.phone}</span>
                      <span className="text-gray-500 text-xs">{lead.email}</span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {lead.source}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{lead.budget}</span>
                  </td>

                  {/* Stage Badge */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onStageClick(lead)}
                      className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${
                        STAGE_STYLES[lead.stage] || "bg-gray-100 text-gray-700 border-gray-200"
                      } hover:brightness-95 transition-all cursor-pointer shadow-sm`}
                    >
                      {lead.stage}
                    </button>
                  </td>

                  {/* Agent */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {lead.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
                  </td>

                  {/* Actions - UPDATED: Removed hover opacity classes */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toast.success(`Calling ${lead.phone}...`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast("Details view coming soon")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lead"
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