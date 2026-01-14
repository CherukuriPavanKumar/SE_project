import { Filter } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface LeadFunnelChartProps {
  metrics: ReportMetrics;
}

export default function LeadFunnelChart({ metrics }: LeadFunnelChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Lead Funnel</h3>
          <p className="text-sm text-gray-500">Conversion progression</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <Filter className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="space-y-3 relative flex-1 flex flex-col justify-center">
        {/* Visual Line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-indigo-100 -translate-x-1/2 -z-10"></div>

        {metrics.leadsByStage.map((stage, index) => {
          const percentage = metrics.totalLeads > 0 
            ? Math.round((stage.count / metrics.totalLeads) * 100) 
            : 0;
          
          // Funnel width logic
          const widthClass = [
            "w-full", "w-[90%]", "w-[80%]", "w-[70%]", "w-[60%]"
          ][index] || "w-[50%]";

          const opacityClass = [
            "bg-indigo-600", "bg-indigo-500", "bg-indigo-400", "bg-indigo-300", "bg-indigo-200"
          ][index] || "bg-indigo-100";

          return (
            <div key={stage.stage} className={`mx-auto ${widthClass} transition-all duration-500 group`}>
              <div className={`
                rounded-xl p-3 flex justify-between items-center relative overflow-hidden shadow-sm
                ${index === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}
              `}>
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${opacityClass}`}></div>
                
                <div className="pl-3">
                  <p className={`font-bold text-sm ${index === 0 ? 'text-white' : 'text-gray-900'}`}>{stage.stage}</p>
                  <p className={`text-[10px] uppercase font-medium ${index === 0 ? 'text-indigo-200' : 'text-gray-500'}`}>Stage {index + 1}</p>
                </div>
                
                <div className="text-right">
                  <span className={`block font-bold ${index === 0 ? 'text-white' : 'text-gray-900'}`}>{stage.count}</span>
                  <span className={`text-xs ${index === 0 ? 'text-indigo-200' : 'text-gray-500'}`}>{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Overall Success Rate</span>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
          <span className="text-lg font-bold text-green-700">{metrics.leadConversionRate}%</span>
          <span className="text-[10px] font-bold text-green-600 uppercase">Conversion</span>
        </div>
      </div>
    </div>
  );
}