"use client";

import { useState, useMemo } from "react";
import { Plus, Folder, ArrowLeft, RefreshCcw } from "lucide-react";
import type { Document } from "@/lib/types";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { deleteDocument as deleteDocumentAction } from "@/lib/redux/slices/documentSlice";

import DocumentStats from "./components/DocumentStats";
import DocumentFilters from "./components/DocumentFilters";
import DocumentListView from "./components/DocumentListView";
import DocumentDetailsModal from "./components/DocumentDetailsModal";
import AddDocumentModal from "./components/AddDocumentModal";

import toast from "react-hot-toast";

// Define folder categories
const FOLDERS = [
  { id: "Property", label: "Properties", count: 0, color: "bg-blue-100 text-blue-600" },
  { id: "Lead", label: "Leads", count: 0, color: "bg-purple-100 text-purple-600" },
  { id: "Deal", label: "Deals", count: 0, color: "bg-orange-100 text-orange-600" },
  { id: "Client", label: "Clients", count: 0, color: "bg-green-100 text-green-600" },
  { id: "Other", label: "Others", count: 0, color: "bg-gray-100 text-gray-600" },
];

export default function DocumentsPage() {
  const documents = useAppSelector((state) => state.documents.items);
  const dispatch = useAppDispatch();

  // Navigation State
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Filter State (Global & Inside Folder)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Calculate folder counts dynamically
  const folderStats = useMemo(() => {
    return FOLDERS.map(folder => ({
      ...folder,
      count: documents.filter(doc => (doc.relatedTo === folder.id) || (folder.id === "Other" && !["Property", "Lead", "Deal", "Client"].includes(doc.relatedTo))).length
    }));
  }, [documents]);

  // Filter Logic
  const filteredDocuments = useMemo(() => {
    // 1. Filter by current folder if selected
    const docs = currentFolder 
      ? documents.filter(doc => 
          (doc.relatedTo === currentFolder) || 
          (currentFolder === "Other" && !["Property", "Lead", "Deal", "Client"].includes(doc.relatedTo))
        )
      : documents;

    // 2. Apply Search & Dropdown Filters
    return docs.filter((doc) => {
      const matchesSearch =
        doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All Types" || doc.documentType === selectedType;
      const matchesStatus = selectedStatus === "All Status" || doc.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, currentFolder, searchQuery, selectedType, selectedStatus]);

  // View Handlers
  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
    setSearchQuery(""); // Clear search when entering folder
  };

  const handleBackToRoot = () => {
    setCurrentFolder(null);
    setSearchQuery("");
  };

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

  const handleResetFilters = () => {
    setCurrentFolder(null);
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    toast.success("Filters reset");
  };

  // Determine view state
  const isSearching = searchQuery.length > 0;
  const showFolders = !currentFolder && !isSearching;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Header - Updated to match Lead Management style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your property and client documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-3 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Document
          </button>
        </div>
      </div>

      {/* Show Stats only on Root */}
      {!currentFolder && !isSearching && (
        <DocumentStats documents={documents} />
      )}

      {/* Filters (Always visible to allow searching) */}
      <DocumentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] p-6">
        
        {/* Folder Grid View (Root Only) */}
        {showFolders && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folderStats.map((folder) => (
              <div 
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                className="group p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center gap-3"
              >
                <div className={`p-4 rounded-full ${folder.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <Folder className="h-8 w-8 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{folder.label}</h3>
                  <p className="text-sm text-gray-500 font-medium">{folder.count} files</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File List View (Inside Folder or Searching) */}
        {(!showFolders) && (
          <div>
            {currentFolder && (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <button 
                  onClick={handleBackToRoot}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">
                  {isSearching ? "Search Results" : FOLDERS.find(f => f.id === currentFolder)?.label}
                </h2>
                <span className="text-sm text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                  {filteredDocuments.length} items
                </span>
              </div>
            )}

            <DocumentListView 
              documents={filteredDocuments} 
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteDocument}
            />
          </div>
        )}
      </div>

      {/* Modals */}
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