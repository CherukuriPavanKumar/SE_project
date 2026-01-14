import Image from "next/image";
import { X, MapPin, Bed, Bath, Maximize, ArrowRight, Share2, Heart } from "lucide-react";
import type { Property } from "@/lib/types";
import toast from "react-hot-toast";

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
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

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto group">
            <Image
              src={property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Image Actions */}
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
            
            {/* Header (Sticky on scroll inside modal if needed, but here we use flex box) */}
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
                {/* Desktop Close Button */}
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

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Property Details</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {property.description || "This luxury property features modern amenities, spacious interiors, and is located in a prime neighborhood. Perfect for families looking for comfort and style. Contact us for a guided tour."}
                </p>
              </div>

              {/* Agent Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {property.listedBy.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Listed by {property.listedBy}</p>
                  <p className="text-xs text-blue-600 font-medium">Real Estate Agent</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Listed On</p>
                  <p className="text-xs font-semibold text-gray-900">{property.listedDate}</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex gap-3">
              <button 
                onClick={() => toast.success("Scheduling...")}
                className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm text-sm"
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