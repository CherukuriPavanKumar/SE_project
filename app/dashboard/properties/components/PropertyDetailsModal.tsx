import Image from "next/image";
import { X, MapPin, Bed, Bath, Maximize, Calendar, User, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/types";
import toast from "react-hot-toast";

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-700 ring-green-600/20";
      case "Sold": return "bg-red-100 text-red-700 ring-red-600/20";
      case "Under Negotiation": return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Left: Image 
                FIX: Changed md:h-auto to md:h-full min-h-[400px] 
                This ensures the container has height even with 'fill' image 
            */}
            <div className="relative h-64 md:h-full md:min-h-[400px] bg-gray-100">
              <Image
                src={property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority // Load this image faster since it's above the fold in the modal
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
              <button
                onClick={onClose}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-colors md:hidden text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Right: Content */}
            <div className="p-8 flex flex-col h-full bg-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">ID: {property.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{property.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{property.location}</span>
                  </div>
                </div>
                <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-8 border-b border-gray-100 pb-6">
                <p className="text-4xl font-bold text-blue-600 tracking-tight">{property.price}</p>
                <p className="text-sm text-gray-400 mt-1 font-medium">{property.type}</p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                  <Bed className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Beds</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                  <Bath className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{property.bathrooms}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Baths</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                  <Maximize className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{property.area}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Sqft</p>
                </div>
              </div>

              {/* Description */}
              <div className="flex-grow mb-8">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About Property</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {property.description || "No detailed description provided for this property. Please contact the listing agent for more information."}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t border-gray-100 pt-6 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Listed by <span className="font-semibold text-gray-700">{property.listedBy}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Listed on <span className="font-semibold text-gray-700">{property.listedDate}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => toast.success("Scheduling site visit...")}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Schedule Visit
                </button>
                <button
                  onClick={() => toast.success("Opening full editor...")}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Edit Details <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}