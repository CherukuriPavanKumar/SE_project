import { MoreHorizontal } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface DealPipelineChartProps {
  metrics: ReportMetrics;
}

export default function DealPipelineChart({ metrics }: DealPipelineChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const colors = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-green-500", "bg-red-500"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Deal Pipeline</h3>
          <p className="text-sm text-gray-500">Value distribution by stage</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {metrics.dealsByStage.map((stage, index) => {
          const percentage = metrics.totalDeals > 0 
            ? Math.round((stage.count / metrics.totalDeals) * 100) 
            : 0;

          return (
            <div key={stage.stage} className="group">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${colors[index % colors.length]} ring-2 ring-white shadow-sm`}></div>
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium text-gray-500 text-xs">{formatCurrency(stage.value)}</span>
                  <span className="font-bold text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded text-xs min-w-[30px] text-center">{stage.count}</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pipeline</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(metrics.totalDealValue)}</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Won</p>
          <p className="text-lg font-bold text-green-700 mt-0.5">{metrics.wonDeals}</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Lost</p>
          <p className="text-lg font-bold text-red-700 mt-0.5">{metrics.lostDeals}</p>
        </div>
      </div>
    </div>
  );
}