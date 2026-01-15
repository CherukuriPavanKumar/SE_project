import { useState } from "react";
import { X, Upload, FileText, Tag, Calendar, Link, File } from "lucide-react";
import type { Document } from "@/lib/types";
import { documentTypes, relatedToOptions } from "@/lib/constants";

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

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
  const selectClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upload Document</h3>
              <p className="text-xs text-gray-500 mt-0.5">Add a new file to the repository</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddDocument} className="px-6 py-6 max-h-[75vh] overflow-y-auto">
            <div className="space-y-5">
              
              {/* Dropzone */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG (max 10MB)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Document Name *</label>
                  <div className="relative group">
                    <FileText className={iconClass} />
                    <input
                      type="text"
                      required
                      value={formData.documentName}
                      onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Sale Agreement - Villa 45"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Type *</label>
                  <div className="relative group">
                    <File className={iconClass} />
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      className={selectClass}
                    >
                      {documentTypes.filter((t) => t !== "All Types").map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category *</label>
                  <div className="relative group">
                    <Tag className={iconClass} />
                    <select
                      value={formData.relatedTo}
                      onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                      className={selectClass}
                    >
                      {relatedToOptions.filter((o) => o !== "All").map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Related Entity *</label>
                  <div className="relative group">
                    <Link className={iconClass} />
                    <input
                      type="text"
                      required
                      value={formData.relatedEntity}
                      onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                      className={inputClass}
                      placeholder="Name of Property, Lead, or Client"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">File Size (Mock) *</label>
                  <input
                    type="text"
                    required
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. 2.4 MB"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                  <div className="relative group">
                    <Calendar className={iconClass} />
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Tags</label>
                  <div className="relative group">
                    <Tag className={iconClass} />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className={inputClass}
                      placeholder="legal, contract, urgent (comma separated)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
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