import { X, Phone, Mail, Building2, Calendar, MapPin, Tag, User, CreditCard, ArrowRight } from "lucide-react";
import type { Client } from "@/lib/types";
import toast from "react-hot-toast";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

export default function ClientDetailsModal({ client, onClose }: ClientDetailsModalProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-700 ring-purple-600/20";
      case "Active": return "bg-green-100 text-green-700 ring-green-600/20";
      case "Inactive": return "bg-gray-100 text-gray-700 ring-gray-600/20";
      default: return "bg-blue-100 text-blue-700 ring-blue-600/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {client.id}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-8 bg-gray-50/30 space-y-8">
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600"><CreditCard className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Total Value</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalValue}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Building2 className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Properties</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalPurchases}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><User className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Agent</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{client.preferredAgent}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Contact Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="h-3 w-3" /> Contact Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500 flex items-center gap-2"><Phone className="h-3.5 w-3.5"/> Phone</span>
                      <span className="text-sm font-medium text-gray-900">{client.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500 flex items-center gap-2"><Mail className="h-3.5 w-3.5"/> Email</span>
                      <span className="text-sm font-medium text-gray-900">{client.email}</span>
                    </div>
                    {client.company && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-500 flex items-center gap-2"><Building2 className="h-3.5 w-3.5"/> Company</span>
                        <span className="text-sm font-medium text-gray-900">{client.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Activity Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Member Since</span>
                      <span className="font-medium text-gray-900">{client.joinedDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Last Interaction</span>
                      <span className="font-medium text-gray-900">{client.lastInteraction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Portfolio */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-full">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Portfolio
                  </h4>
                  {client.propertiesOwned.length > 0 ? (
                    <div className="space-y-2">
                      {client.propertiesOwned.map((prop, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="bg-white p-1.5 rounded shadow-sm">
                            <Building2 className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{prop}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No properties owned yet.</p>
                  )}
                </div>

                {/* Tags */}
                {client.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {client.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100 flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Notes</h4>
                <p className="text-sm text-gray-700 italic">&quot;{client.notes}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors">
              Close
            </button>
            <button onClick={() => toast.success("Opening full profile...")} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-semibold flex items-center gap-2 shadow-md transition-all">
              Full Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}