import { FileText, File, Calendar, User, Download, Edit, Trash2 } from "lucide-react";
import type { Document } from "@/lib/types";
import toast from "react-hot-toast";

interface DocumentGridProps {
  documents: Document[];
  onViewDetails: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentGrid({ documents, onViewDetails, onDelete }: DocumentGridProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      Active: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Verified: "bg-blue-100 text-blue-700",
      Expired: "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Sale Agreement": "text-blue-600",
      "Title Deed": "text-purple-600",
      "KYC": "text-green-600",
      "Payment Receipt": "text-orange-600",
      "Tax Certificate": "text-red-600",
      "Loan Document": "text-indigo-600",
      "Completion Certificate": "text-pink-600",
      "NOC": "text-teal-600",
      "Site Report": "text-cyan-600",
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.length === 0 ? (
        <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No documents found. Try adjusting your filters.</p>
        </div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onViewDetails(doc)}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="text-xs opacity-80">{doc.documentType}</p>
                    <p className="text-sm font-medium">{doc.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {doc.documentName}
              </h3>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <File className={`h-3 w-3 ${getTypeColor(doc.documentType)}`} />
                  <span className="font-medium">{doc.relatedTo}:</span>
                  <span className="truncate">{doc.relatedEntity}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Uploaded: {doc.uploadDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{doc.uploadedBy}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {doc.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500 font-medium">{doc.fileSize}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Download"
                    onClick={() => toast.success(`Downloading ${doc.documentName}`)}
                  >
                    <Download className="h-4 w-4" />
                  </button>
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
                    onClick={() => onDelete(doc.id)}
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
