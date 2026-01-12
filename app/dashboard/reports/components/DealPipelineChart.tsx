import { PieChart } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Deal Pipeline</h3>
          <p className="text-sm text-gray-500">Distribution by stage</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-5">
        {metrics.dealsByStage.map((stage, index) => {
          const percentage = metrics.totalDeals > 0 
            ? Math.round((stage.count / metrics.totalDeals) * 100) 
            : 0;

          return (
            <div key={stage.stage} className="group">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {stage.stage}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{stage.count}</span>
                  <span className="text-gray-400 text-xs ml-1">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-400 text-right">
                Value: {formatCurrency(stage.value)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Value</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(metrics.totalDealValue)}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xs font-semibold text-green-600 uppercase">Won</p>
          <p className="text-lg font-bold text-green-700 mt-1">{metrics.wonDeals}</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xs font-semibold text-red-600 uppercase">Lost</p>
          <p className="text-lg font-bold text-red-700 mt-1">{metrics.lostDeals}</p>
        </div>
      </div>
    </div>
  );
}