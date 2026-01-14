import { BarChart3, Download, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md border border-white/20">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">
            Real-time insights into business performance
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>Last 30 Days</span>
        </div>
        <button 
          onClick={() => toast.success("Downloading report...")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}