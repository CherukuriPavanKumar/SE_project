import { useMemo } from "react";
import { FileText, CheckCircle, FileCheck, Clock } from "lucide-react";
import type { Document } from "@/lib/types";

interface DocumentStatsProps {
  documents: Document[];
}

export default function DocumentStats({ documents }: DocumentStatsProps) {
  const stats = useMemo(() => [
    {
      label: "Total Files",
      value: documents.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: FileText,
    },
    {
      label: "Active",
      value: documents.filter((d) => d.status === "Active").length,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle,
    },
    {
      label: "Verified",
      value: documents.filter((d) => d.status === "Verified").length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: FileCheck,
    },
    {
      label: "Pending",
      value: documents.filter((d) => d.status === "Pending").length,
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: Clock,
    },
  ], [documents]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group cursor-default">
          <div>
            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${stat.color}`}>{stat.value}</p>
          </div>
          <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}