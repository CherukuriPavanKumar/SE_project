"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Document } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteDocument as deleteDocumentAction } from "@/lib/redux/slices/documentSlice";

import DocumentStats from "./components/DocumentStats";
import DocumentFilters from "./components/DocumentFilters";
import DocumentGrid from "./components/DocumentGrid";
import DocumentDetailsModal from "./components/DocumentDetailsModal";
import AddDocumentModal from "./components/AddDocumentModal";

import toast from "react-hot-toast";

export default function DocumentsPage() {
  const documents = useAppSelector((state) => state.documents.items);
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRelatedTo, setSelectedRelatedTo] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All Types" || doc.documentType === selectedType;
      const matchesStatus = selectedStatus === "All Status" || doc.status === selectedStatus;
      const matchesRelatedTo = selectedRelatedTo === "All" || doc.relatedTo === selectedRelatedTo;

      return matchesSearch && matchesType && matchesStatus && matchesRelatedTo;
    });
  }, [documents, searchQuery, selectedType, selectedStatus, selectedRelatedTo]);

  const handleViewDetails = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDetailsModal(true);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocumentAction(id));
      toast.success("Document deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all your property and client documents</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      <DocumentStats documents={documents} />

      <DocumentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedRelatedTo={selectedRelatedTo}
        setSelectedRelatedTo={setSelectedRelatedTo}
      />

      <DocumentGrid
        documents={filteredDocuments}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteDocument}
      />

      {showDetailsModal && selectedDocument && (
        <DocumentDetailsModal
          document={selectedDocument}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAddModal && <AddDocumentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
