import { useState, useMemo } from "react";
import Image from "next/image";
import { X, MapPin, Bed, Bath, Maximize, ArrowRight, Share2, Heart, User, Phone, Mail, Edit2, Save, Loader2, IndianRupee, CheckCircle } from "lucide-react";
import type { Property, Lead } from "@/lib/types";
import { propertyStatuses, propertyTypes } from "@/lib/constants";
import toast from "react-hot-toast";

// Hooks & Redux
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateProperty as updatePropertyState } from "@/lib/redux/slices/propertySlice";
import { useClientData } from "@/hooks/clients/use-client-data"; 
import { useAgentData } from "@/hooks/agents/use-agent-data";

// Server Action
import { updateProperty as updatePropertyServer } from "../actions";

interface PropertyDetailsModalProps {
  property: Property;
  interestedLeads: Lead[];
  onClose: () => void;
  onViewLead: (lead: Lead) => void;
}

type PropertyStatus = "Available" | "Sold" | "Under Negotiation";

// Extended interface to handle dynamic metadata safely
interface ExtendedProperty extends Property {
  soldTo?: string;
}

export default function PropertyDetailsModal({ property, interestedLeads, onClose, onViewLead }: PropertyDetailsModalProps) {
  useClientData();
  useAgentData();

  const dispatch = useAppDispatch();
  const clients = useAppSelector((state) => state.clients.items);
  const activeClients = useMemo(() => clients.filter((c) => c.status === "Active" || c.status === "VIP"), [clients]);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Safe cast for accessing metadata fields
  const propExtended = property as ExtendedProperty;

  const [formData, setFormData] = useState({
    title: property.title,
    location: property.location,
    price: property.price,
    type: property.type,
    status: property.status as PropertyStatus,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    description: property.description,
    listedBy: property.listedBy || "",
    soldTo: propExtended.soldTo || "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Sold": return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      case "Under Negotiation": return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  const handleSave = async () => {
    if (formData.status === "Sold" && !formData.soldTo) {
        toast.error("Please select a buyer in the 'Sold To' field.");
        return;
    }

    setIsLoading(true);
    try {
      const result = await updatePropertyServer(property.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      dispatch(updatePropertyState({
        id: property.id,
        data: formData
      }));

      toast.success("Property details updated!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update property");
    } finally {
      setIsLoading(false);
    }
  };

  const editInputClass = "w-full px-2 py-1 text-sm border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30";
  const editSelectClass = "w-full px-2 py-1 text-sm border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-blue-50/30 cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-6">
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden text-left transform transition-all flex flex-col md:flex-row max-h-[90vh] md:h-[600px]">
          
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/20 text-white backdrop-blur-md rounded-full md:hidden"><X className="h-5 w-5" /></button>

          <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto group">
            <Image src={property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"} alt={property.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            {!isEditing && (
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm backdrop-blur-sm"><Heart className="h-4 w-4" /></button>
                <button className="p-2.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm backdrop-blur-sm"><Share2 className="h-4 w-4" /></button>
                </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
            <div className="p-6 md:p-8 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as PropertyStatus})} className={`${editSelectClass} w-1/2`}>{propertyStatuses.filter(s => s !== "All Status").map(s => <option key={s} value={s}>{s}</option>)}</select>
                            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className={`${editSelectClass} w-1/2`}>{propertyTypes.filter(t => t !== "All Types").map(t => <option key={t} value={t}>{t}</option>)}</select>
                        </div>
                        {formData.status === "Sold" && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] text-green-600 font-bold uppercase tracking-wider block mb-1">Sold To</label>
                                <select value={formData.soldTo} onChange={(e) => setFormData({...formData, soldTo: e.target.value})} className={`${editSelectClass} border-green-200 bg-green-50/50 text-green-800`}>
                                    <option value="">Select Buyer</option>{activeClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${editInputClass} text-xl font-bold`} placeholder="Property Title"/>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 shrink-0" /><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={editInputClass} placeholder="Location"/></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(property.status)}`}>{property.status}</span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">{property.type}</span>
                        {propExtended.soldTo && property.status === "Sold" && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"><CheckCircle className="h-3 w-3" /> Sold to {propExtended.soldTo}</span>}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{property.title}</h2>
                      <div className="flex items-center gap-2 text-gray-500 text-sm"><MapPin className="h-4 w-4 text-blue-600 shrink-0" /><span>{property.location}</span></div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                    {!isEditing && <button onClick={() => setIsEditing(true)} className="hidden md:flex p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit Details"><Edit2 className="h-5 w-5" /></button>}
                    <button onClick={onClose} className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="h-6 w-6" /></button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              <div>
                {isEditing ? <div className="flex items-center gap-2 mb-6"><IndianRupee className="h-6 w-6 text-blue-600" /><input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className={`${editInputClass} text-2xl font-bold text-blue-600 w-48`} placeholder="Price"/></div> : <p className="text-4xl font-bold text-blue-600 tracking-tight mb-6">{property.price}</p>}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"><Bed className="h-5 w-5 mx-auto mb-2 text-gray-400" />{isEditing ? <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})} className={`${editInputClass} text-center font-bold`} /> : <span className="block text-lg font-bold text-gray-900">{property.bedrooms}</span>}<span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mt-1">Beds</span></div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"><Bath className="h-5 w-5 mx-auto mb-2 text-gray-400" />{isEditing ? <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})} className={`${editInputClass} text-center font-bold`} /> : <span className="block text-lg font-bold text-gray-900">{property.bathrooms}</span>}<span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mt-1">Baths</span></div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"><Maximize className="h-5 w-5 mx-auto mb-2 text-gray-400" />{isEditing ? <input type="text" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className={`${editInputClass} text-center font-bold`} /> : <span className="block text-lg font-bold text-gray-900">{property.area}</span>}<span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mt-1">Sqft</span></div>
                </div>
              </div>
              <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About Property</h3>{isEditing ? <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" placeholder="Detailed description..."/> : <p className="text-gray-600 leading-relaxed text-sm">{property.description || "No detailed description available."}</p>}</div>
              {!isEditing && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2"><User className="h-4 w-4 text-indigo-600" /> Potential Leads ({interestedLeads.length})</h3>
                    {interestedLeads.length > 0 ? (
                    <div className="space-y-2">{interestedLeads.map((lead) => (<div key={lead.id} onClick={() => onViewLead(lead)} className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all cursor-pointer group"><div><p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{lead.name}</p><div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5"><span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {lead.phone}</span><span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {lead.email}</span></div></div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white ${lead.stage === "New Lead" ? "text-blue-600 border-blue-200" : lead.stage === "Closed" ? "text-green-600 border-green-200" : "text-gray-600 border-gray-200"}`}>{lead.stage}</span></div>))}</div>
                    ) : <p className="text-sm text-gray-500 italic">No leads have expressed interest in this property yet.</p>}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex gap-3">
              {isEditing ? (
                <>
                    <button onClick={() => { setIsEditing(false); setFormData({ title: property.title, location: property.location, price: property.price, type: property.type, status: property.status as PropertyStatus, bedrooms: property.bedrooms, bathrooms: property.bathrooms, area: property.area, description: property.description, listedBy: property.listedBy || "", soldTo: propExtended.soldTo || "" }); }} className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">Cancel</button>
                    <button onClick={handleSave} disabled={isLoading} className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2">{isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Save className="h-4 w-4" /> Save Changes</>}</button>
                </>
              ) : (
                <button onClick={() => toast.success("Scheduling visit...")} className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 group">Schedule Visit <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}