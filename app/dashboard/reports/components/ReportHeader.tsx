import { BarChart3 } from "lucide-react";

export default function ReportHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
        <BarChart3 className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time insights into business performance and growth
        </p>
      </div>
    </div>
  );
}