import { X, User, Home, DollarSign, Percent, Calendar, MapPin } from "lucide-react";
import type { Deal } from "@/lib/types";
import toast from "react-hot-toast";

interface DealDetailsModalProps {
  deal: Deal;
  onClose: () => void;
}

export default function DealDetailsModal({ deal, onClose }: DealDetailsModalProps) {
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Qualified":
        return "bg-blue-100 text-blue-700";
      case "Proposal Sent":
        return "bg-purple-100 text-purple-700";
      case "Negotiation":
        return "bg-orange-100 text-orange-700";
      case "Closed Won":
        return "bg-green-100 text-green-700";
      case "Closed Lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Partial":
        return "bg-orange-100 text-orange-700";
      case "N/A":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600";
    if (probability >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Deal Details</h3>
              <p className="text-sm opacity-90 mt-1">{deal.id}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">Deal Stage</p>
                <p className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${getStageBadge(deal.dealStage)}`}>
                  {deal.dealStage}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-green-600 font-medium mb-1">Probability</p>
                <p className={`text-2xl font-bold ${getProbabilityColor(deal.probability)}`}>
                  {deal.probability}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">Payment Status</p>
                <p className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${getPaymentBadge(deal.paymentStatus)}`}>
                  {deal.paymentStatus}
                </p>
              </div>
            </div>

            {/* Lead Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Lead Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium text-gray-900">{deal.leadName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium text-gray-900">{deal.leadPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{deal.leadEmail}</span>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Home className="h-4 w-4 text-purple-600" />
                Property Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{deal.propertyTitle}</p>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{deal.propertyAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                  <span className="text-sm text-gray-600">Property Price:</span>
                  <span className="text-sm font-bold text-gray-900">{deal.propertyPrice}</span>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Deal Value</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{deal.dealValue}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Percent className="h-5 w-5" />
                  <span className="text-sm font-medium">Commission</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{deal.commission}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expected Closing:</span>
                  <span className="text-sm font-medium text-gray-900">{deal.closingDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned Agent:</span>
                  <span className="text-sm font-medium text-gray-900">{deal.assignedAgent}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {deal.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{deal.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => toast.success("Document generation coming soon!")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
