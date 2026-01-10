import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { Document } from "@/lib/types";
import { documentTypes, documentStatuses, relatedToOptions } from "@/lib/constants";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addDocument as addDocumentAction } from "@/lib/redux/slices/documentSlice";

import toast from "react-hot-toast";

interface AddDocumentModalProps {
  onClose: () => void;
}

export default function AddDocumentModal({ onClose }: AddDocumentModalProps) {
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.items);
  const agents = useAppSelector((state) => state.agents.items);

  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "Sale Agreement",
    relatedTo: "Property",
    relatedEntity: "",
    uploadedBy: agents.find((a) => a.status === "Active")?.name || "",
    fileSize: "",
    status: "Active",
    expiryDate: "",
    tags: "",
  });

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.documentName || !formData.relatedEntity || !formData.fileSize) {
      toast.error("Please fill all required fields");
      return;
    }

    const newDocument: Document = {
      id: `DOC${String(documents.length + 1).padStart(3, "0")}`,
      documentName: formData.documentName,
      documentType: formData.documentType,
      relatedTo: formData.relatedTo,
      relatedEntity: formData.relatedEntity,
      uploadedBy: formData.uploadedBy,
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: formData.fileSize,
      status: formData.status,
      expiryDate: formData.expiryDate || undefined,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    dispatch(addDocumentAction(newDocument));
    onClose();
    toast.success("Document uploaded successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload New Document</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleAddDocument} className="px-6 py-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.documentName}
                    onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Sale Agreement - Property Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type *
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {documentTypes
                      .filter((t) => t !== "All Types")
                      .map((type) => (
                        <option key={type} value={type} className="text-gray-900">
                          {type}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related To *
                  </label>
                  <select
                    value={formData.relatedTo}
                    onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {relatedToOptions
                      .filter((o) => o !== "All")
                      .map((option) => (
                        <option key={option} value={option} className="text-gray-900">
                          {option}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Entity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.relatedEntity}
                    onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Property/Lead/Deal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="2.4 MB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {documentStatuses
                      .filter((s) => s !== "All Status")
                      .map((status) => (
                        <option key={status} value={status} className="text-gray-900">
                          {status}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uploaded By *
                  </label>
                  <select
                    value={formData.uploadedBy}
                    onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {agents
                      .filter((a) => a.status === "Active")
                      .map((agent) => (
                        <option key={agent.id} value={agent.name} className="text-gray-900">
                          {agent.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Sale, Contract, Legal"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
