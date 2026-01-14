import { useMemo } from "react";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import type { SiteVisit } from "@/lib/types";

interface SiteVisitStatsProps {
  visits: SiteVisit[];
}

export default function SiteVisitStats({ visits }: SiteVisitStatsProps) {
  // ⚡ OPTIMIZATION: Memoize statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        label: "Total Visits",
        value: visits.length,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: MapPin,
      },
      {
        label: "Scheduled",
        value: visits.filter((v) => v.status === "Scheduled").length,
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Clock,
      },
      {
        label: "Completed",
        value: visits.filter((v) => v.status === "Completed").length,
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle,
      },
      {
        label: "Today's Schedule",
        value: visits.filter((v) => v.visitDate === today).length,
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: Calendar,
      },
    ];
  }, [visits]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 group cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1.5 ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}