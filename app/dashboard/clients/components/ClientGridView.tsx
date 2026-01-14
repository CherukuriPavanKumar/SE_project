import { Phone, Mail, Building2, Edit, Trash2, Eye } from "lucide-react";
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
      case "VIP": return "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20";
      case "Active": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.length === 0 ? (
        <div className="col-span-full p-16 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-lg font-medium text-gray-900 mb-1">No clients found</p>
          <p className="text-sm">Try adjusting your search.</p>
        </div>
      ) : (
        clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onViewDetails(client)}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col hover:border-blue-300"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-50 bg-gradient-to-br from-white to-gray-50/50 relative">
              <div className="flex justify-between items-start mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                  {client.name.charAt(0)}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{client.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <Building2 className="h-3 w-3 text-gray-400"/> {client.company || "Individual Investor"}
              </p>
            </div>

            {/* Info */}
            <div className="p-5 space-y-4 flex-1">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" /> <span className="font-medium">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" /> <span className="truncate">{client.email}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-px border border-gray-100 divide-x divide-gray-200">
                <div className="px-2">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Portfolio</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{client.totalValue}</p>
                </div>
                <div className="px-2 pl-4">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Properties</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{client.totalPurchases}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Agent</span>
                <span className="text-xs font-semibold text-gray-700">{client.preferredAgent}</span>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onViewDetails(client)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye className="h-4 w-4"/></button>
                <button onClick={() => toast("Edit")} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Edit className="h-4 w-4"/></button>
                <button onClick={() => onDelete(client.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}