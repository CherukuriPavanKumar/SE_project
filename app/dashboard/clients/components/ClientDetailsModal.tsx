import { X, Phone, Mail, Building2, Calendar, MapPin, Tag } from "lucide-react";
import type { Client } from "@/lib/types";
import toast from "react-hot-toast";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

export default function ClientDetailsModal({ client, onClose }: ClientDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-100 text-purple-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
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
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{client.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{client.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">Status</p>
                <p
                  className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${getStatusBadge(
                    client.status
                  )}`}
                >
                  {client.status}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-green-600 font-medium mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{client.totalValue}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{client.totalPurchases}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone:
                  </span>
                  <span className="font-medium text-gray-900">{client.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email:
                  </span>
                  <span className="font-medium text-gray-900">{client.email}</span>
                </div>
                {client.company && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company:
                    </span>
                    <span className="font-medium text-gray-900">{client.company}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Properties Owned</h4>
              <div className="space-y-2">
                {client.propertiesOwned.map((property, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{property}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Joined Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{client.joinedDate}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Last Interaction</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {client.lastInteraction}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Preferred Agent</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {client.preferredAgent
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.preferredAgent}</p>
                  <p className="text-xs text-gray-500">Account Manager</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{client.notes}</p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("Opening activity history...")}
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Activity
              </button>
              <button
                onClick={() => toast.success("Opening client profile...")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Full Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
