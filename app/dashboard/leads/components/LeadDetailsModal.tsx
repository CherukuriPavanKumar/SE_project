import { useState } from "react";
import { X, User, Phone, Mail, Home, Tag, Calendar, MessageSquare, CheckCircle, ExternalLink, Save, Loader2, Edit2, IndianRupee } from "lucide-react";
import type { Lead } from "@/lib/types";
import { format } from "date-fns";
import { leadSources } from "@/lib/constants"; // Assuming you have this, otherwise hardcode options

// Redux
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateLead as updateLeadState } from "@/lib/redux/slices/leadSlice";

// Server Action
import { updateLead as updateLeadServer } from "../actions";

import toast from "react-hot-toast";

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onStageChange: (lead: Lead, newStage: string) => void;
  onDelete: () => void;
  onViewProperty: (propertyName: string) => void;
}

export default function LeadDetailsModal({ lead, onClose, onStageChange, onDelete, onViewProperty }: LeadDetailsModalProps) {
  const dispatch = useAppDispatch();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    budget: lead.budget,
    notes: lead.notes,
  });

  const getStageColor = (stage: string) => {
    if (stage === "New Lead") return "bg-blue-100 text-blue-700 ring-blue-600/20";
    if (stage === "Closed") return "bg-green-100 text-green-700 ring-green-600/20";
    if (stage === "Discarded") return "bg-red-100 text-red-700 ring-red-600/20";
    return "bg-orange-100 text-orange-700 ring-orange-600/20";
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 1. Call Server Action
      const result = await updateLeadServer(lead.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // 2. Update Redux
      dispatch(updateLeadState({
        id: lead.id,
        data: formData
      }));

      toast.success("Lead updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setIsLoading(false);
    }
  };

  // Styles
  const editInputClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 transition-all";
  const editSelectClass = "w-full px-2.5 py-1.5 text-sm border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 cursor-pointer transition-all";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div className="flex items-center gap-4 w-full">
              <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
                {lead.name.charAt(0)}
              </div>
              <div className="w-full">
                {isEditing ? (
                  <div className="pr-4">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block">Lead Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className={`${editInputClass} text-lg font-bold text-gray-900 h-10`}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${getStageColor(lead.stage)}`}>
                        {lead.stage}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">ID: {lead.id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  title="Edit Details"
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
            
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <User className="h-3 w-3 text-indigo-600" /> Contact Details
                  </h4>
                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5"><Phone className="h-4 w-4"/> Phone</span>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          className={`${editInputClass} w-48`}
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{lead.phone}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5"><Mail className="h-4 w-4"/> Email</span>
                      {isEditing ? (
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          className={`${editInputClass} w-48`}
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{lead.email}</span>
                      )}
                    </div>

                    {/* Source */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-2.5"><Tag className="h-4 w-4"/> Source</span>
                      {isEditing ? (
                        <select 
                          value={formData.source} 
                          onChange={(e) => setFormData({...formData, source: e.target.value})} 
                          className={`${editSelectClass} w-48`}
                        >
                          {leadSources.filter(s => s !== "All Sources").map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{lead.source}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline (Read Only) */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-indigo-600" /> Activity
                  </h4>
                  
                  <div className="space-y-4 relative pl-2">
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Created</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{format(new Date(lead.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Next Follow-up</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{lead.nextFollowUp || "Not scheduled"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Interested Properties & Budget */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Home className="h-3 w-3 text-indigo-600" /> Interested Properties
                  </h4>
                  
                  <div className="flex-1">
                    {lead.propertyInterest && lead.propertyInterest.length > 0 ? (
                      <div className="space-y-3">
                        {lead.propertyInterest.map((propName, i) => (
                          <button 
                            key={i} 
                            onClick={() => onViewProperty(propName)} 
                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all group text-left"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="bg-white p-2 rounded-md shadow-sm text-blue-600 group-hover:text-blue-700">
                                <Home className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-800">{propName}</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="p-3 bg-gray-50 rounded-full mb-3">
                          <Home className="h-6 w-6 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-500">General Inquiry (No specific properties)</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><IndianRupee className="h-3 w-3"/> Budget</span>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={formData.budget} 
                            onChange={(e) => setFormData({...formData, budget: e.target.value})} 
                            className={`${editInputClass} w-32 text-right`}
                            placeholder="e.g. 50L"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-900">{lead.budget || "Not Specified"}</span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className={`rounded-xl p-5 border ${isEditing ? 'bg-white border-yellow-200 ring-2 ring-yellow-500/10' : 'bg-yellow-50/50 border-yellow-100'}`}>
              <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Notes</h4>
              {isEditing ? (
                <textarea 
                  rows={3} 
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder:text-gray-400 p-0 resize-none leading-relaxed"
                  placeholder="Add notes about this lead..."
                />
              ) : (
                <p className="text-sm text-gray-700 italic leading-relaxed">{lead.notes || "No notes added."}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-between items-center rounded-b-2xl">
            {isEditing ? (
              <div className="flex justify-end gap-3 w-full">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ // Reset form
                      name: lead.name,
                      email: lead.email,
                      phone: lead.phone,
                      source: lead.source,
                      budget: lead.budget,
                      notes: lead.notes,
                    });
                  }} 
                  disabled={isLoading}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Save className="h-4 w-4" /> Save Changes</>}
                </button>
              </div>
            ) : (
              <>
                <button 
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline px-2"
                >
                    Delete Lead
                </button>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors shadow-sm">
                    Close
                    </button>
                    {lead.stage !== "Closed" && (
                        <button 
                        onClick={() => onStageChange(lead, "Closed")} 
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                        <CheckCircle className="h-4 w-4" /> Convert to Client
                        </button>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}