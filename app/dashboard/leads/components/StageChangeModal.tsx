import { X, CheckCircle, XCircle } from "lucide-react";
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
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Change Lead Stage</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Update stage for <span className="font-medium text-gray-900">{lead.name}</span>
            </p>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs text-gray-600 mb-3">
              Current Stage: <span className="font-semibold">{lead.stage}</span>
            </p>
            <div className="space-y-2">
              {leadStages
                .filter((s) => s !== "All Stages" && s !== lead.stage)
                .map((stage) => (
                  <button
                    key={stage}
                    onClick={() => onStageChange(lead, stage)}
                    className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all hover:shadow-md ${
                      stage === "Closed"
                        ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                        : stage === "Discarded"
                        ? "border-red-300 bg-red-50 hover:bg-red-100"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {stage === "Closed" && <CheckCircle className="h-5 w-5 text-purple-600" />}
                        {stage === "Discarded" && <XCircle className="h-5 w-5 text-red-600" />}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{stage}</p>
                          {stage === "Closed" && (
                            <p className="text-xs text-purple-600">
                              Will convert to client automatically
                            </p>
                          )}
                          {stage === "Discarded" && (
                            <p className="text-xs text-red-600">Lead did not convert</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
