import { Phone, Mail, Building2, Edit, Trash2 } from "lucide-react";
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-700";
      case "Active": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.length === 0 ? (
        <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
          No clients found.
        </div>
      ) : (
        clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onViewDetails(client)}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-50 bg-gradient-to-br from-white to-gray-50/50">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {client.name.charAt(0)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-0.5 group-hover:text-blue-600 transition-colors">{client.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                {client.company ? <><Building2 className="h-3 w-3"/> {client.company}</> : "Individual Investor"}
              </p>
            </div>

            {/* Info */}
            <div className="p-5 space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> {client.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> <span className="truncate">{client.email}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 border border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Portfolio</p>
                  <p className="text-sm font-bold text-gray-900">{client.totalValue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Properties</p>
                  <p className="text-sm font-bold text-gray-900">{client.totalPurchases}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <span className="text-xs text-gray-400">Agent: {client.preferredAgent}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toast("Edit")} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit className="h-3.5 w-3.5"/></button>
                <button onClick={() => onDelete(client.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="h-3.5 w-3.5"/></button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}