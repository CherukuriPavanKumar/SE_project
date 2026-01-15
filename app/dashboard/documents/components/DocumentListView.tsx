import { FileText, Download, Eye, Trash2, Calendar, User } from "lucide-react";
import type { Document } from "@/lib/types";
import toast from "react-hot-toast";

interface DocumentListViewProps {
  documents: Document[];
  onViewDetails: (doc: Document) => void;
  onDelete: (id: string) => void;
}

export default function DocumentListView({ documents, onViewDetails, onDelete }: DocumentListViewProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Verified": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Expired": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getFileIconColor = (type: string) => {
    if (type.includes("Agreement")) return "text-blue-600 bg-blue-50";
    if (type.includes("Deed")) return "text-purple-600 bg-purple-50";
    if (type.includes("Tax") || type.includes("Finance")) return "text-green-600 bg-green-50";
    return "text-gray-600 bg-gray-50";
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-gray-50 rounded-full mb-3">
          <FileText className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">No documents found in this folder.</p>
        <p className="text-sm text-gray-400 mt-1">Upload a new file to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Related To</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold text-center">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Size</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((doc) => {
            const iconStyle = getFileIconColor(doc.documentType);
            
            return (
              <tr 
                key={doc.id} 
                onClick={() => onViewDetails(doc)}
                className="hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconStyle}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]" title={doc.documentName}>
                        {doc.documentName}
                      </p>
                      <p className="text-xs text-gray-500">ID: {doc.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 truncate max-w-[150px]" title={doc.relatedEntity}>
                    {doc.relatedEntity}
                  </p>
                  <p className="text-xs text-gray-500">{doc.relatedTo}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {doc.documentType}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {doc.uploadDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <User className="h-3 w-3" /> {doc.uploadedBy.split(" ")[0]}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                  {doc.fileSize}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  {/* REMOVED: opacity-0 group-hover:opacity-100 */}
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => toast.success(`Downloading ${doc.documentName}`)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onViewDetails(doc)}
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(doc.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}