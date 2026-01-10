import { Phone, Mail, Building2, Edit, Trash2, Users } from "lucide-react";
import type { Client } from "@/lib/types";
import toast from "react-hot-toast";

interface ClientGridViewProps {
  clients: Client[];
  onViewDetails: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientGridView({
  clients,
  onViewDetails,
  onDelete,
}: ClientGridViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-100 text-purple-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.length === 0 ? (
        <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No clients found. Try adjusting your filters.</p>
        </div>
      ) : (
        clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onViewDetails(client)}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-xs opacity-80">{client.id}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    client.status
                  )}`}
                >
                  {client.status}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{client.company}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">Total Value</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalValue}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium">Properties</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalPurchases}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {client.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <p>Joined: {client.joinedDate}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                    onClick={() => onDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
