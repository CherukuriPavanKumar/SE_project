import { useState, useMemo } from "react";
import { X, Plus, Building2, DollarSign, User, Loader2, MapPin, Check, Phone, Mail } from "lucide-react";
import type { Client, Property } from "@/lib/types";
import { clientStatuses } from "@/lib/constants";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addClient as addClientAction } from "@/lib/redux/slices/clientSlice";
import { addProperty as addPropertyAction } from "@/lib/redux/slices/propertySlice";

// 1. Import Server Action
import { addClient as addClientServer } from "../actions";

import toast from "react-hot-toast";

interface AddClientModalProps {
  onClose: () => void;
}

type ClientStatus = "Active" | "VIP" | "Inactive";

export default function AddClientModal({ onClose }: AddClientModalProps) {
  const dispatch = useAppDispatch();
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredAgent: agents.find((a) => a.status === "Active")?.name || "",
    tags: "",
    notes: "",
    status: "Active" as ClientStatus, 
  });

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  
  const [newPropertyData, setNewPropertyData] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    status: "Available",
    bedrooms: "2",
    bathrooms: "2",
    area: "",
    description: "",
    listedBy: agents.find((a) => a.status === "Active")?.name || "",
  });

  const activeAgents = useMemo(() => agents.filter((a) => a.status === "Active"), [agents]);
  
  const availableProperties = useMemo(() => properties.filter((p) => ["Available", "Sold"].includes(p.status)), [properties]);

  const calculateTotalValue = () => {
    const selected = properties.filter((p) => selectedPropertyIds.includes(p.id));
    const total = selected.reduce((sum, prop) => {
      const val = parseFloat(prop.price.replace(/[₹,LakhsCr\s]/g, "") || "0");
      return sum + (prop.price.includes("Cr") ? val * 100 : val); 
    }, 0);
    
    if (total >= 100) return `₹${(total / 100).toFixed(2)} Cr`; 
    return `₹${total.toFixed(2)} L`;
  };

  const handleAddNewProperty = () => {
    if (!newPropertyData.title || !newPropertyData.location || !newPropertyData.price) {
      toast.error("Please fill all required property fields");
      return;
    }

    // Note: This only adds to Redux for now. In a real app, you'd want a separate server action for properties too.
    const newProperty: Property = {
      id: `P${String(properties.length + 1).padStart(3, "0")}`,
      title: newPropertyData.title,
      location: newPropertyData.location,
      price: newPropertyData.price,
      type: newPropertyData.type,
      status: newPropertyData.status as "Available" | "Sold" | "Under Negotiation",
      bedrooms: parseInt(newPropertyData.bedrooms),
      bathrooms: parseInt(newPropertyData.bathrooms),
      area: newPropertyData.area,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      description: newPropertyData.description,
      listedBy: newPropertyData.listedBy,
      listedDate: new Date().toISOString().split("T")[0],
    };

    dispatch(addPropertyAction(newProperty));
    setSelectedPropertyIds([...selectedPropertyIds, newProperty.id]);
    
    setNewPropertyData({
      title: "", location: "", price: "", type: "Apartment", status: "Available",
      bedrooms: "2", bathrooms: "2", area: "", description: "",
      listedBy: agents.find((a) => a.status === "Active")?.name || "",
    });
    
    setShowAddProperty(false);
    toast.success("Property added and selected!");
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill required fields");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Prepare Payload for Server Action
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: formData.status,
        preferredAgent: formData.preferredAgent,
        tags: formData.tags,
        notes: formData.notes,
        propertyIds: selectedPropertyIds // Pass selected IDs to be stored in metadata
      };

      // 3. Call Server Action
      const result = await addClientServer(payload);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.newClient) {
        
        // 4. Update Redux with the new client returned from DB
        // We manually inject the calculated values for the UI since they aren't fully in DB yet
        const clientForUI: Client = {
          ...result.newClient,
          totalPurchases: selectedPropertyIds.length,
          totalValue: calculateTotalValue(),
          propertiesOwned: properties.filter(p => selectedPropertyIds.includes(p.id)).map(p => p.title)
        };

        dispatch(addClientAction(clientForUI));
        
        toast.success("Client added successfully!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Shared classes
  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add New Client</h3>
              <p className="text-xs text-gray-500 mt-0.5">Register a new investor or buyer</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddClient} className="px-6 py-6 max-h-[75vh] overflow-y-auto space-y-8">
            
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Client Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative group">
                    <User className={iconClass} />
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone *</label>
                  <div className="relative group">
                    <Phone className={iconClass} />
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email *</label>
                  <div className="relative group">
                    <Mail className={iconClass} />
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Company</label>
                  <div className="relative group">
                    <Building2 className={iconClass} />
                    <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={inputClass} placeholder="Optional" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Status & Agent */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Building2 className="h-3 w-3" /> Account Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
                  >
                    {clientStatuses.filter(s => s !== "All Status").map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Preferred Agent</label>
                  <select value={formData.preferredAgent} onChange={e => setFormData({...formData, preferredAgent: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none">
                    {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Properties Owned */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Portfolio (Optional)
                </h4>
                <button 
                  type="button" 
                  onClick={() => setShowAddProperty(!showAddProperty)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3" /> {showAddProperty ? "Cancel" : "Add Property"}
                </button>
              </div>
              
              {showAddProperty && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4 animate-fade-in">
                  <h5 className="text-sm font-semibold text-blue-900 mb-3">Quick Add Property</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" value={newPropertyData.title} onChange={e => setNewPropertyData({...newPropertyData, title: e.target.value})} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Title *" />
                    <input type="text" value={newPropertyData.location} onChange={e => setNewPropertyData({...newPropertyData, location: e.target.value})} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Location *" />
                    <input type="text" value={newPropertyData.price} onChange={e => setNewPropertyData({...newPropertyData, price: e.target.value})} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Price *" />
                    <button type="button" onClick={handleAddNewProperty} className="bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 px-4">Save</button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-48 overflow-y-auto space-y-2">
                {availableProperties.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No available properties found.</p>
                ) : (
                  availableProperties.map(prop => (
                    <label key={prop.id} className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg hover:border-blue-300 cursor-pointer transition-colors shadow-sm">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="checkbox" 
                          checked={selectedPropertyIds.includes(prop.id)} 
                          onChange={() => setSelectedPropertyIds(prev => prev.includes(prop.id) ? prev.filter(id => id !== prop.id) : [...prev, prop.id])}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/20" 
                        />
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                        <p className="text-xs text-gray-500 truncate">{prop.location}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{prop.price}</span>
                    </label>
                  ))
                )}
              </div>
              
              {selectedPropertyIds.length > 0 && (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100 text-sm shadow-sm">
                  <span className="text-green-800 font-medium">Selected: {selectedPropertyIds.length} Properties</span>
                  <span className="text-green-800 font-bold flex items-center gap-1"><DollarSign className="h-4 w-4"/> {calculateTotalValue()}</span>
                </div>
              )}
            </div>

            {/* 4. Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-sm font-semibold text-gray-700">Notes</label>
              <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" placeholder="Any additional details..."></textarea>
            </div>

          </form>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-semibold shadow-sm">Cancel</button>
            <button onClick={handleAddClient} disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Client"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}