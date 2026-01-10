import { Calendar, FileText } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface AdditionalMetricsProps {
  metrics: ReportMetrics;
}

export default function AdditionalMetrics({ metrics }: AdditionalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Property Status</h3>
        <div className="space-y-3">
          {metrics.propertiesByStatus.map((status) => (
            <div key={status.status} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{status.status}</span>
              <span className="text-sm font-bold text-gray-900">{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Site Visits
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Visits</span>
            <span className="text-sm font-bold text-gray-900">{metrics.totalSiteVisits}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Upcoming</span>
            <span className="text-sm font-bold text-blue-600">{metrics.upcomingVisits}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="text-sm font-bold text-green-600">{metrics.completedVisits}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Documents</span>
            <span className="text-sm font-bold text-gray-900">{metrics.totalDocuments}</span>
          </div>
          {metrics.documentsByStatus.slice(0, 3).map((status) => (
            <div key={status.status} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{status.status}</span>
              <span className="text-sm font-bold text-gray-900">{status.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
