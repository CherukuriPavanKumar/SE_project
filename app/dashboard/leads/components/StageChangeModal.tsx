import { X, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import type { Lead } from "@/lib/types";
import { leadStages } from "@/lib/constants";

interface StageChangeModalProps {
  lead: Lead;
  onClose: () => void;
  onStageChange: (lead: Lead, newStage: string) => void;
}

export default function StageChangeModal({
  lead,
  onClose,
  onStageChange,
}: StageChangeModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Update Stage</h3>
              <p className="text-xs text-gray-500 mt-0.5">Move <strong>{lead.name}</strong> to a new pipeline stage</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-6 bg-white">
            <div className="flex items-center justify-between mb-6 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Current Stage</span>
              <span className="text-sm font-bold text-gray-900">{lead.stage}</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {leadStages
                .filter((s) => s !== "All Stages" && s !== lead.stage)
                .map((stage) => (
                  <button
                    key={stage}
                    onClick={() => onStageChange(lead, stage)}
                    className={`group w-full px-4 py-3 text-left rounded-lg border transition-all flex items-center justify-between ${
                      stage === "Closed"
                        ? "border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-300"
                        : stage === "Discarded"
                        ? "border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-300"
                        : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {stage === "Closed" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                       stage === "Discarded" ? <XCircle className="h-5 w-5 text-red-600" /> :
                       <div className="h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors"></div>
                      }
                      
                      <div>
                        <p className={`text-sm font-semibold ${stage === "Closed" ? "text-green-900" : stage === "Discarded" ? "text-red-900" : "text-gray-700"}`}>{stage}</p>
                        {stage === "Closed" && <p className="text-[10px] text-green-700 font-medium mt-0.5">✨ Converts to Client</p>}
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${
                       stage === "Closed" ? "text-green-600" : stage === "Discarded" ? "text-red-600" : "text-blue-500"
                    }`} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}