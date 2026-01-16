import Image from "next/image";
import { X, MapPin, Bed, Bath, Maximize, ArrowRight, Share2, Heart, User, Phone, Mail } from "lucide-react";
import type { Property, Lead } from "@/lib/types";
import toast from "react-hot-toast";

interface PropertyDetailsModalProps {
  property: Property;
  interestedLeads: Lead[];
  onClose: () => void;
  onViewLead: (lead: Lead) => void; // New callback
}

export default function PropertyDetailsModal({ property, interestedLeads, onClose, onViewLead }: PropertyDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Sold": return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      case "Under Negotiation": return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-6">
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden text-left transform transition-all flex flex-col md:flex-row max-h-[90vh] md:h-[600px]">
          
          {/* Close Button (Mobile) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/20 text-white backdrop-blur-md rounded-full md:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Image */}
          <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto group">
            <Image
              src={property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <button className="p-2.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm backdrop-blur-sm">
                <Heart className="h-4 w-4" />
              </button>
              <button className="p-2.5 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm backdrop-blur-sm">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">
                      {property.type}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Price & Stats */}
              <div>
                <p className="text-4xl font-bold text-blue-600 tracking-tight mb-6">
                  {property.price}
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <Bed className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <span className="block text-lg font-bold text-gray-900">{property.bedrooms}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Beds</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <Bath className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <span className="block text-lg font-bold text-gray-900">{property.bathrooms}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Baths</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <Maximize className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                    <span className="block text-lg font-bold text-gray-900">{property.area}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Sqft</span>
                  </div>
                </div>
              </div>

              {/* Potential Leads Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" /> Potential Leads ({interestedLeads.length})
                </h3>
                {interestedLeads.length > 0 ? (
                  <div className="space-y-2">
                    {interestedLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        onClick={() => onViewLead(lead)} // Handle Click
                        className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all cursor-pointer group"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{lead.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {lead.phone}</span>
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {lead.email}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white ${
                          lead.stage === "New Lead" ? "text-blue-600 border-blue-200" : 
                          lead.stage === "Closed" ? "text-green-600 border-green-200" : "text-gray-600 border-gray-200"
                        }`}>
                          {lead.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No leads have expressed interest in this property yet.</p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About Property</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {property.description || "No detailed description available."}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex gap-3">
              <button 
                onClick={() => toast.success("Scheduling visit...")}
                className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm"
              >
                Schedule Visit
              </button>
              <button 
                onClick={() => toast.success("Opening editor...")}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 group"
              >
                Edit Details 
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}