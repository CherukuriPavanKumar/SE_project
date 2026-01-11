import { X, User, Home, DollarSign,Calendar, MapPin, Phone, Mail, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Deal } from "@/lib/types";
import toast from "react-hot-toast";

interface DealDetailsModalProps {
  deal: Deal;
  onClose: () => void;
}

export default function DealDetailsModal({ deal, onClose }: DealDetailsModalProps) {
  
  const getStageColor = (s: string) => {
    switch (s) {
      case "Qualified": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Proposal Sent": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Negotiation": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Closed Won": return "bg-green-100 text-green-700 border-green-200";
      case "Closed Lost": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStageColor(deal.dealStage)}`}>
                  {deal.dealStage}
                </span>
                <span className="text-xs text-gray-400 font-mono">#{deal.id}</span>
                <span className="text-xs text-gray-400">• {new Date(deal.createdAt || "").toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{deal.propertyTitle}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-8 bg-gray-50/30">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Main Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Deal Overview Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" /> Deal Terms
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">{deal.dealValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Commission</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-gray-900">{deal.commission}</p>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Win Probability</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${deal.probability > 75 ? 'bg-green-500' : 'bg-blue-500'}`} 
                            style={{ width: `${deal.probability}%` }} 
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{deal.probability}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(deal.paymentStatus)}
                        <span className="text-sm font-medium text-gray-900">{deal.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Property & Lead Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Home className="h-3 w-3" /> Property
                    </h4>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{deal.propertyTitle}</p>
                    <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{deal.propertyAddress}</span>
                    </div>
                    <div className="mt-3 text-xs">
                      <span className="text-gray-400">Listed:</span> <span className="font-medium text-gray-700">{deal.propertyPrice}</span>
                    </div>
                  </div>

                  {/* Lead */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="h-3 w-3" /> Client
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {deal.leadName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{deal.leadName}</p>
                        <p className="text-xs text-gray-500">Lead</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="h-3 w-3" /> {deal.leadPhone}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="h-3 w-3" /> {deal.leadEmail}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Notes Area */}
                {deal.notes && (
                  <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-5">
                    <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Notes
                    </h4>
                    <p className="text-sm text-gray-700 italic leading-relaxed">&quot;{deal.notes}&quot;</p>
                  </div>
                )}
              </div>

              {/* Right Column: Timeline & Actions */}
              <div className="space-y-6">
                
                {/* Timeline Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" /> Key Dates
                  </h4>
                  
                  <div className="space-y-6 relative pl-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Created</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{new Date(deal.createdAt || "").toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-50 border-2 border-white shadow-sm flex items-center justify-center z-10 shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Target Close</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{deal.closingDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Assigned Agent</p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {deal.assignedAgent.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{deal.assignedAgent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-white border-t border-gray-100 flex justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Close
            </button>
            <button 
              onClick={() => toast.success("Contract generation started...")} 
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}