import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import type { SiteVisit } from "@/lib/types";

interface SiteVisitStatsProps {
  visits: SiteVisit[];
}

export default function SiteVisitStats({ visits }: SiteVisitStatsProps) {
  const stats = [
    {
      label: "Total Visits",
      value: visits.length,
      color: "text-blue-600",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "Scheduled",
      value: visits.filter((v) => v.status === "Scheduled").length,
      color: "text-orange-600",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Completed",
      value: visits.filter((v) => v.status === "Completed").length,
      color: "text-green-600",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Today's Visits",
      value: visits.filter((v) => v.visitDate === new Date().toISOString().split("T")[0]).length,
      color: "text-purple-600",
      icon: <Calendar className="h-5 w-5" />,
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
