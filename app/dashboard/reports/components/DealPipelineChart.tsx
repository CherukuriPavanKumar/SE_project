import { PieChart } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface DealPipelineChartProps {
  metrics: ReportMetrics;
}

export default function DealPipelineChart({ metrics }: DealPipelineChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-gray-500",
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Deal Pipeline</h3>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {metrics.dealsByStage.map((stage, index) => {
          const percentage =
            metrics.totalDeals > 0
              ? Math.round((stage.count / metrics.totalDeals) * 100)
              : 0;

          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">{stage.stage}</span>
                <span className="text-gray-600">
                  {stage.count} deals ({formatCurrency(stage.value)})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${colors[index % colors.length]} h-2 rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Total Value</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(metrics.totalDealValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Won</p>
            <p className="text-lg font-bold text-green-600">{metrics.wonDeals}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Lost</p>
            <p className="text-lg font-bold text-red-600">{metrics.lostDeals}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
