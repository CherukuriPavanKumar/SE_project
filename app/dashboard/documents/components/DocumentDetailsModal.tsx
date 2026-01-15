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
      Active: "bg-green-100 text-green-700 ring-green-600/20",
      Pending: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
      Verified: "bg-blue-100 text-blue-700 ring-blue-600/20",
      Expired: "bg-red-100 text-red-700 ring-red-600/20",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700 ring-gray-600/20";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${getStatusBadge(document.status)}`}>
                  {document.status}
                </span>
                <span className="text-xs text-gray-500 font-mono">ID: {document.id}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{document.documentName}</h3>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            
            {/* File Preview Card */}
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200 border-dashed">
              <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{document.documentName}</p>
              <p className="text-xs text-gray-500 font-mono">{document.fileSize} • {document.documentType}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Related To</p>
                <p className="text-sm font-semibold text-gray-900">{document.relatedTo}</p>
                <p className="text-sm text-gray-600 mt-0.5 truncate">{document.relatedEntity}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Metadata</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <User className="h-3.5 w-3.5 text-gray-400" /> {document.uploadedBy}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" /> {document.uploadDate}
                </div>
              </div>
            </div>

            {document.expiryDate && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-xs text-yellow-700 font-bold uppercase">Expires On</p>
                  <p className="text-sm font-semibold text-yellow-900">{document.expiryDate}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-200 shadow-sm flex items-center gap-1.5"
                  >
                    <Tag className="h-3 w-3 text-gray-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm">
              Close
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("Opening document viewer...")}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => toast.success(`Downloading ${document.documentName}`)}
                className="px-5 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}