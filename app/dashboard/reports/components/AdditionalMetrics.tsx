import { Calendar, FileText, CheckCircle2, Clock } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface AdditionalMetricsProps {
  metrics: ReportMetrics;
}

export default function AdditionalMetrics({ metrics }: AdditionalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Property Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Property Inventory</h3>
        <div className="space-y-4">
          {metrics.propertiesByStatus.map((status) => (
            <div key={status.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${status.status === 'Sold' ? 'bg-green-500' : status.status === 'Available' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">{status.status}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Site Visits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Site Visits</h3>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-blue-600 font-semibold uppercase">Upcoming</p>
            <p className="text-2xl font-bold text-blue-700">{metrics.upcomingVisits}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-green-600 font-semibold uppercase">Completed</p>
            <p className="text-2xl font-bold text-green-700">{metrics.completedVisits}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">Total Visits Scheduled: <span className="font-bold text-gray-900">{metrics.totalSiteVisits}</span></p>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Documentation</h3>
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative h-24 w-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin-slow" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">{metrics.totalDocuments}</span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Total</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {metrics.documentsByStatus.slice(0, 3).map((status) => (
            <div key={status.status} className="flex justify-between text-sm">
              <span className="text-gray-600">{status.status}</span>
              <span className="font-medium text-gray-900">{status.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}