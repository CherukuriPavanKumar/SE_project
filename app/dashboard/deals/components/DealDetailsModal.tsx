import { X, User, Home, DollarSign, Calendar, MapPin, Phone, Mail, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Deal } from "@/lib/types";
import toast from "react-hot-toast";

interface DealDetailsModalProps {
  deal: Deal;
  onClose: () => void;
}

export default function DealDetailsModal({ deal, onClose }: DealDetailsModalProps) {
  
  const getStageColor = (s: string) => {
    switch (s) {
      case "Qualified": return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
      case "Proposal Sent": return "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20";
      case "Negotiation": return "bg-orange-100 text-orange-700 ring-1 ring-orange-600/20";
      case "Closed Won": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "Closed Lost": return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    if (status === "Paid") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === "Pending") return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStageColor(deal.dealStage)}`}>
                  {deal.dealStage}
                </span>
                <span className="text-xs text-gray-500 font-mono">ID: {deal.id}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{deal.propertyTitle}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            
            {/* 1. Deal Overview (High Priority) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" /> Financials
              </h4>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Deal Value</p>
                  <p className="text-2xl font-bold text-gray-900">{deal.dealValue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Est. Commission</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">{deal.commission}</p>
                    <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold">2%</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Win Probability</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${deal.probability > 75 ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${deal.probability}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{deal.probability}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Payment Status</p>
                  <div className="flex items-center gap-1.5">
                    {getPaymentStatusIcon(deal.paymentStatus)}
                    <span className="text-sm font-medium text-gray-900">{deal.paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Lead Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="h-3 w-3" /> Client Details
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {deal.leadName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{deal.leadName}</p>
                    <p className="text-xs text-gray-500">Lead</p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-11">
                  <p className="text-xs text-gray-600 flex items-center gap-2"><Phone className="h-3 w-3 text-blue-400" /> {deal.leadPhone}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-2"><Mail className="h-3 w-3 text-blue-400" /> {deal.leadEmail}</p>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Home className="h-3 w-3" /> Property Context
                </h4>
                <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">{deal.propertyTitle}</p>
                <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-3">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-purple-500" />
                  <span className="line-clamp-2">{deal.propertyAddress}</span>
                </div>
                <div className="text-xs bg-white/50 p-2 rounded border border-purple-100 inline-block">
                  <span className="text-gray-500">Original List Price:</span> <span className="font-semibold text-gray-900">{deal.propertyPrice}</span>
                </div>
              </div>
            </div>

            {/* 3. Timeline & Agent */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-6 w-full sm:w-auto">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Closing Target</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {deal.closingDate}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Created On</p>
                  <p className="text-sm text-gray-700">{new Date(deal.createdAt || "").toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto">
                <div className="h-7 w-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {deal.assignedAgent.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Agent</p>
                  <p className="text-xs font-bold text-gray-900">{deal.assignedAgent}</p>
                </div>
              </div>
            </div>

            {/* 4. Notes */}
            {deal.notes && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> Notes
                </h4>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">&quot;{deal.notes}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold shadow-sm"
            >
              Close
            </button>
            <button 
              onClick={() => toast.success("Contract generation started...")} 
              className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}