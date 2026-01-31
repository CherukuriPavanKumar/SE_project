import { useState, useMemo } from "react";
import { X, Loader2, Home, MapPin, IndianRupee, Bed, Bath, Maximize, Tag, ChevronDown, UserCheck } from "lucide-react";
import { propertyTypes, propertyStatuses } from "@/lib/constants";

// Redux
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addProperty as addPropertyAction } from "@/lib/redux/slices/propertySlice";

// Hooks
import { useAgentData } from "@/hooks/agents/use-agent-data";
import { useClientData } from "@/hooks/clients/use-client-data";

// Server Action
import { addProperty as addPropertyServer } from "../actions";

import toast from "react-hot-toast";

interface AddPropertyModalProps {
  onClose: () => void;
}

export default function AddPropertyModal({ onClose }: AddPropertyModalProps) {
  // Ensure data availability
  useAgentData();
  useClientData();

  const dispatch = useAppDispatch();
  const agents = useAppSelector((state) => state.agents.items);
  const clients = useAppSelector((state) => state.clients.items);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", location: "", price: "", type: "Apartment", status: "Available",
    bedrooms: "2", bathrooms: "2", area: "", description: "",
    listedBy: "", soldTo: "",
  });

  const activeAgents = useMemo(() => agents.filter((a) => a.status === "Active"), [agents]);
  const activeClients = useMemo(() => clients.filter((c) => c.status === "Active" || c.status === "VIP"), [clients]);

  // Auto-select first active agent
  useMemo(() => {
    if (activeAgents.length > 0 && !formData.listedBy) {
      setFormData(prev => ({ ...prev, listedBy: activeAgents[0].name }));
    }
  }, [activeAgents.length]); 

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.price || !formData.area) {
        toast.error("Please fill in all required fields.");
        return;
    }

    if (formData.status === "Sold" && !formData.soldTo) {
      toast.error("Please select the client who bought this property.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await addPropertyServer({
        title: formData.title,
        location: formData.location,
        price: formData.price,
        type: formData.type,
        status: formData.status as "Available" | "Sold" | "Under Negotiation",
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: formData.area,
        description: formData.description,
        listedBy: formData.listedBy,
        soldTo: formData.status === "Sold" ? formData.soldTo : undefined
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.newProperty) {
        dispatch(addPropertyAction(result.newProperty));
        onClose();
        toast.success("Property added successfully!");
      }
    } catch (error) {
      console.error("Add Property Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
  const selectClass = "w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div><h3 className="text-lg font-bold text-gray-900">Add New Property</h3><p className="text-xs text-gray-500 mt-0.5">List a new property in the inventory</p></div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"><X className="h-5 w-5" /></button>
          </div>

          <form onSubmit={handleAddProperty} className="px-6 py-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><Home className="h-3 w-3" /> Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5"><label htmlFor="title" className="block text-sm font-semibold text-gray-700">Property Title *</label><div className="relative group"><Tag className={iconClass} /><input type="text" id="title" required value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Luxury 3BHK Apartment" /></div></div>
                <div className="md:col-span-2 space-y-1.5"><label htmlFor="location" className="block text-sm font-semibold text-gray-700">Location *</label><div className="relative group"><MapPin className={iconClass} /><input type="text" id="location" required value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Whitefield, Bangalore" /></div></div>
                <div className="space-y-1.5"><label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price *</label><div className="relative group"><IndianRupee className={iconClass} /><input type="text" id="price" required value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. 1.5 Cr" /></div></div>
                <div className="space-y-1.5"><label htmlFor="type" className="block text-sm font-semibold text-gray-700">Type *</label><div className="relative group"><select id="type" value={formData.type} onChange={handleChange} className={`${selectClass} pl-4`}>{propertyTypes.filter((t) => t !== "All Types").map((type) => <option key={type} value={type}>{type}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2 pt-2 border-t border-gray-100"><Tag className="h-3 w-3" /> Status & Assignment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5"><label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status</label><div className="relative group"><select id="status" value={formData.status} onChange={handleChange} className={`${selectClass} pl-4`}>{propertyStatuses.filter((s) => s !== "All Status").map((status) => <option key={status} value={status}>{status}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
                <div className="space-y-1.5"><label htmlFor="listedBy" className="block text-sm font-semibold text-gray-700">Listed By</label><div className="relative group"><select id="listedBy" value={formData.listedBy} onChange={handleChange} className={`${selectClass} pl-4`}>{activeAgents.map((agent) => <option key={agent.id} value={agent.name}>{agent.name}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /></div></div>
                {formData.status === "Sold" && (
                  <div className="md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label htmlFor="soldTo" className="block text-sm font-semibold text-green-700">Sold To Client *</label>
                    <div className="relative group"><UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 z-10" /><select id="soldTo" value={formData.soldTo} onChange={handleChange} className={`${selectClass} pl-10 border-green-300 focus:ring-green-500/20 focus:border-green-500 bg-green-50/30`}><option value="">Select Buyer</option>{activeClients.map((client) => <option key={client.id} value={client.name}>{client.name} ({client.phone})</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 pointer-events-none" /></div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                <div className="space-y-1.5"><label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700">Bedrooms</label><div className="relative group"><Bed className={iconClass} /><input type="number" id="bedrooms" min="0" required value={formData.bedrooms} onChange={handleChange} className={inputClass} /></div></div>
                <div className="space-y-1.5"><label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-700">Bathrooms</label><div className="relative group"><Bath className={iconClass} /><input type="number" id="bathrooms" min="0" required value={formData.bathrooms} onChange={handleChange} className={inputClass} /></div></div>
                <div className="space-y-1.5"><label htmlFor="area" className="block text-sm font-semibold text-gray-700">Area</label><div className="relative group"><Maximize className={iconClass} /><input type="text" id="area" required value={formData.area} onChange={handleChange} className={inputClass} placeholder="1500 sqft" /></div></div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100"><label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea id="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none" placeholder="Detailed property description..."></textarea></div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium flex items-center gap-2">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "List Property"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}