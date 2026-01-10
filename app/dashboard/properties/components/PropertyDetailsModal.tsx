import Image from "next/image";
import { X, MapPin, Bed, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";
import toast from "react-hot-toast";

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Image */}
          <div className="relative h-64 bg-gray-200">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  property.status
                )}`}
              >
                {property.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{property.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{property.price}</p>
                <p className="text-sm text-gray-500 mt-1">{property.type}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Bed className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="text-lg font-bold text-gray-900">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Bath className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="text-lg font-bold text-gray-900">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Maximize className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Area</p>
                <p className="text-lg font-bold text-gray-900">{property.area}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Property ID</p>
                  <p className="text-sm font-medium text-gray-900">{property.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Listed By</p>
                  <p className="text-sm font-medium text-gray-900">{property.listedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Listed Date</p>
                  <p className="text-sm font-medium text-gray-900">{property.listedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-sm font-medium text-gray-900">{property.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("Scheduling site visit...")}
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Schedule Visit
              </button>
              <button
                onClick={() => toast.success("Opening property details...")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
