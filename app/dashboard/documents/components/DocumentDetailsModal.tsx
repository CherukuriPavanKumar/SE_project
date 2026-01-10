import { X, FileText, User, Calendar, Tag, AlertCircle, Download, Eye } from "lucide-react";
import type { Document } from "@/lib/types";
import toast from "react-hot-toast";

interface DocumentDetailsModalProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentDetailsModal({ document, onClose }: DocumentDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      Active: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Verified: "bg-blue-100 text-blue-700",
      Expired: "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">Document Details</h3>
                <p className="text-sm opacity-90 mt-1">{document.id}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-2">{document.documentName}</p>
              <p className="text-xs text-gray-500">{document.fileSize}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">Document Type</p>
                <p className="text-sm font-bold text-gray-900">{document.documentType}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">Status</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(document.status)}`}>
                  {document.status}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Related Information</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{document.relatedTo}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Related Entity:</span>
                  <span className="font-medium text-gray-900">{document.relatedEntity}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Uploaded By</p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{document.uploadedBy}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Upload Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{document.uploadDate}</span>
                </div>
              </div>
            </div>

            {document.expiryDate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xs text-yellow-700 font-medium">Expiry Date</p>
                    <p className="text-sm font-bold text-yellow-900">{document.expiryDate}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
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
                onClick={() => toast.success(`Downloading ${document.documentName}`)}
                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => toast.success("Opening document viewer...")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
