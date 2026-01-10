import { Activity } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface LeadFunnelChartProps {
  metrics: ReportMetrics;
}

export default function LeadFunnelChart({ metrics }: LeadFunnelChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Lead Funnel</h3>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {metrics.leadsByStage.map((stage, index) => {
          const percentage =
            metrics.totalLeads > 0
              ? Math.round((stage.count / metrics.totalLeads) * 100)
              : 0;
          return (
            <div
              key={stage.stage}
              className="relative"
              style={{ marginLeft: `${index * 20}px` }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-sm opacity-90">
                    {stage.count} ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Conversion Rate</span>
          <span className="text-2xl font-bold text-green-600">
            {metrics.leadConversionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
