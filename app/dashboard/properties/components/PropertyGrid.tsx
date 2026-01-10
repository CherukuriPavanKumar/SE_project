import Image from "next/image";
import { Home, MapPin, Bed, Bath, Maximize, Edit, Trash2 } from "lucide-react";
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
      case "Available":
        return "bg-green-100 text-green-700";
      case "Sold":
        return "bg-red-100 text-red-700";
      case "Under Negotiation":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.length === 0 ? (
        <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No properties found. Try adjusting your filters.</p>
        </div>
      ) : (
        properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onViewDetails(property)}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    property.status
                  )}`}
                >
                  {property.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                  {property.type}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Maximize className="h-4 w-4" />
                    <span>{property.area}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{property.price}</p>
                  <p className="text-xs text-gray-500">Listed by {property.listedBy}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="text-orange-600 hover:text-orange-900 transition-colors"
                    title="Edit"
                    onClick={() => toast("Edit feature coming soon")}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 transition-colors"
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
