import { Filter } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface LeadFunnelChartProps {
  metrics: ReportMetrics;
}

export default function LeadFunnelChart({ metrics }: LeadFunnelChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Lead Funnel</h3>
          <p className="text-sm text-gray-500">Conversion progression</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4 relative">
        {/* Connecting Line (Visual Aid) */}
        <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

        {metrics.leadsByStage.map((stage, index) => {
          const percentage = metrics.totalLeads > 0 
            ? Math.round((stage.count / metrics.totalLeads) * 100) 
            : 0;
          
          // Visual width reduction for funnel effect
          const widthClass = [
            "w-full", "w-[95%]", "w-[90%]", "w-[85%]", "w-[80%]"
          ][index] || "w-[75%]";

          return (
            <div key={stage.stage} className={`relative flex items-center gap-4 ${widthClass} ml-auto mr-auto transition-all`}>
              <div className="h-14 w-14 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center shrink-0 z-10 shadow-sm">
                <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-default group">
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-700">{stage.stage}</p>
                  <p className="text-xs text-gray-500">Stage {index + 1}</p>
                </div>
                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                  {stage.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Overall Success</span>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-green-600">{metrics.leadConversionRate}%</span>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">Conversion</span>
        </div>
      </div>
    </div>
  );
}