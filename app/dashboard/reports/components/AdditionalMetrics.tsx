import { Calendar, FileText, CheckCircle2, Clock, Building2 } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface AdditionalMetricsProps {
  metrics: ReportMetrics;
}

export default function AdditionalMetrics({ metrics }: AdditionalMetricsProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Property Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Inventory
        </h3>
        <div className="space-y-3">
          {metrics.propertiesByStatus.map((status) => (
            <div key={status.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ring-2 ring-white shadow-sm ${status.status === 'Sold' ? 'bg-green-500' : status.status === 'Available' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                <span className="text-sm font-semibold text-gray-700">{status.status}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Site Visits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Site Visits
          </h3>
          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{metrics.totalSiteVisits} Total</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Upcoming</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{metrics.upcomingVisits}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Done</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{metrics.completedVisits}</p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4" /> Docs
          </h3>
        </div>
        
        <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div>
            <span className="block text-2xl font-bold text-indigo-900">{metrics.totalDocuments}</span>
            <span className="text-xs text-indigo-700 font-medium">Files Processed</span>
          </div>
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}