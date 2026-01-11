import { Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import type { Client } from "@/lib/types";
import toast from "react-hot-toast";

interface ClientListViewProps {
  clients: Client[];
  onViewDetails: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientListView({
  clients,
  onViewDetails,
  onDelete,
}: ClientListViewProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4">Client Details</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Portfolio Value</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Agent</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onViewDetails(client)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.company || "Individual"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="h-3 w-3 text-gray-400" /> {client.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Mail className="h-3 w-3 text-gray-400" /> {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{client.totalValue}</div>
                    <div className="text-xs text-gray-500">{client.totalPurchases} Properties</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {client.preferredAgent}
                  </td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onViewDetails(client)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => toast("Edit coming soon")} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(client.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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