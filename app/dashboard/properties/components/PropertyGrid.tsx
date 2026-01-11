import Image from "next/image";
import { Home, MapPin, Bed, Bath, Maximize, Edit, Trash2, Eye } from "lucide-react";
import type { Property } from "@/lib/types";
import toast from "react-hot-toast";

interface PropertyGridProps {
  properties: Property[];
  onViewDetails: (property: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyGrid({ properties, onViewDetails, onDelete }: PropertyGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-700";
      case "Sold": return "bg-red-100 text-red-700";
      case "Under Negotiation": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {properties.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No properties found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </div>
      ) : (
        properties.map((property) => (
          <div
            key={property.id}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={() => onViewDetails(property)}
          >
            {/* Image Section */}
            <div className="relative h-56 w-full bg-gray-100">
              <Image
                src={property.image || "/placeholder-property.jpg"} 
                alt={property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badges */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-900 shadow-sm border border-white/50">
                  {property.type}
                </span>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); onViewDetails(property); }}
                  className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{property.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{property.location}</span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100">
                  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <Bed className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-sm font-semibold text-gray-700">{property.bedrooms}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <Bath className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-sm font-semibold text-gray-700">{property.bathrooms}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
                    <Maximize className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-sm font-semibold text-gray-700">{property.area}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Sqft</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                <div>
                  <p className="text-xl font-bold text-blue-600">{property.price}</p>
                  <p className="text-xs text-gray-400 mt-0.5">By {property.listedBy}</p>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit"
                    onClick={() => toast("Edit feature coming soon")}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                    onClick={() => onDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}