import { useState } from "react";
import { X, Phone, Mail, Building2, Calendar, MapPin, Tag, User, CreditCard, Clock, Edit2, Save, Loader2 } from "lucide-react";
import type { Client } from "@/lib/types";
import { clientStatuses } from "@/lib/constants";
import toast from "react-hot-toast";

// Redux
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateClient as updateClientState } from "@/lib/redux/slices/clientSlice";

// Action
import { updateClient as updateClientServer } from "../actions";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

type ClientStatus = "Active" | "Inactive" | "VIP";

export default function ClientDetailsModal({ client, onClose }: ClientDetailsModalProps) {
  const dispatch = useAppDispatch();
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    status: client.status as ClientStatus,
    notes: client.notes,
    tags: client.tags.join(", "),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20";
      case "Active": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Inactive": return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
      default: return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateClientServer(client.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      dispatch(updateClientState({
        id: client.id,
        data: {
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
      }));

      toast.success("Client updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const editInputClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 transition-all";
  const editSelectClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 cursor-pointer transition-all";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div className="flex items-center gap-4 w-full">
              <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                {client.name.charAt(0)}
              </div>
              <div className="w-full">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3 pr-8">
                    <div className="col-span-2">
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className={`${editInputClass} text-lg font-bold text-gray-900`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={(e) => setFormData({...formData, status: e.target.value as ClientStatus})} 
                        className={editSelectClass}
                      >
                        {clientStatuses.filter(s => s !== "All Status").map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Company</label>
                      <input 
                        type="text" 
                        value={formData.company} 
                        onChange={(e) => setFormData({...formData, company: e.target.value})} 
                        className={editInputClass}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">ID: {client.id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  title="Edit Client"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              )}
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-8 py-8 bg-gray-50/30 space-y-8">
            
            {/* Top Stats - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
                <div className="p-3 bg-green-50 rounded-lg text-green-600"><CreditCard className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Value</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalValue}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Building2 className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Properties</p>
                  <p className="text-lg font-bold text-gray-900">{client.totalPurchases}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><User className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Agent</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{client.preferredAgent}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <User className="h-3 w-3 text-blue-600" /> Contact Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5"><Phone className="h-4 w-4"/> Phone</span>
                      {isEditing ? (
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${editInputClass} w-48`}/>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{client.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5"><Mail className="h-4 w-4"/> Email</span>
                      {isEditing ? (
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${editInputClass} w-48`}/>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{client.email}</span>
                      )}
                    </div>
                    {client.company && !isEditing && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-2.5"><Building2 className="h-4 w-4"/> Company</span>
                        <span className="text-sm font-semibold text-gray-900">{client.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-blue-600" /> Activity History
                  </h4>
                  <div className="space-y-6 relative pl-2">
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0"><User className="h-4 w-4 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Joined</p><p className="text-sm font-medium text-gray-900 mt-0.5">{client.joinedDate}</p></div>
                    </div>
                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0"><Clock className="h-4 w-4 text-orange-600" /></div>
                      <div><p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Last Active</p><p className="text-sm font-medium text-gray-900 mt-0.5">{client.lastInteraction}</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-blue-600" /> Property Portfolio
                  </h4>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block">Tags (comma separated)</label>
                        <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className={editInputClass} placeholder="Investor, VIP, etc."/>
                      </div>
                    ) : (
                      <>
                        {client.propertiesOwned.length > 0 ? (
                          <div className="space-y-3">
                            {client.propertiesOwned.map((prop, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="bg-white p-2 rounded-md shadow-sm text-blue-600"><Building2 className="h-4 w-4" /></div>
                                <span className="text-sm font-semibold text-gray-900 line-clamp-1">{prop}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="p-3 bg-gray-50 rounded-full mb-3"><Building2 className="h-6 w-6 text-gray-300" /></div>
                            <p className="text-sm text-gray-500">No properties linked yet.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!isEditing && client.tags.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {client.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200 flex items-center gap-1"><Tag className="h-3 w-3" /> {tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className={`rounded-xl p-5 border ${isEditing ? 'bg-white border-blue-200 ring-2 ring-blue-500/10' : 'bg-yellow-50/50 border-yellow-100'}`}>
              <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Notes</h4>
              {isEditing ? (
                <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 p-0 resize-none leading-relaxed" placeholder="Client notes..."/>
              ) : (
                <p className="text-sm text-gray-700 italic leading-relaxed">&quot;{client.notes}&quot;</p>
              )}
            </div>
          </div>

          {/* Footer - Only visible during editing */}
          {isEditing && (
            <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: client.name, email: client.email, phone: client.phone, company: client.company, status: client.status as ClientStatus, notes: client.notes, tags: client.tags.join(", ") });
                  }} 
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center gap-2 shadow-md transition-all"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Save className="h-4 w-4" /> Save Changes</>}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}