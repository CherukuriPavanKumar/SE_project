import { FileText, CheckCircle, FileCheck, Clock } from "lucide-react";
import type { Document } from "@/lib/types";

interface DocumentStatsProps {
  documents: Document[];
}

export default function DocumentStats({ documents }: DocumentStatsProps) {
  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      color: "text-blue-600",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Active",
      value: documents.filter((d) => d.status === "Active").length,
      color: "text-green-600",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Verified",
      value: documents.filter((d) => d.status === "Verified").length,
      color: "text-blue-600",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      label: "Pending",
      value: documents.filter((d) => d.status === "Pending").length,
      color: "text-orange-600",
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <div className={stat.color}>{stat.icon}</div>
          </div>
          <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
