import { useMemo } from "react";
import { Home, Building2, CheckCircle2, Clock } from "lucide-react";
import type { Property } from "@/lib/types";

interface PropertyStatsProps {
  properties: Property[];
}

export default function PropertyStats({ properties }: PropertyStatsProps) {
  // ⚡ OPTIMIZATION: Memoize stats
  const stats = useMemo(() => {
    const total = properties.length;
    const available = properties.filter((p) => p.status === "Available").length;
    const sold = properties.filter((p) => p.status === "Sold").length;
    const negotiation = properties.filter((p) => p.status === "Under Negotiation").length;

    return [
      {
        label: "Total Listings",
        value: total,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Home,
      },
      {
        label: "Available",
        value: available,
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle2,
      },
      {
        label: "Sold Properties",
        value: sold,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        icon: Building2,
      },
      {
        label: "In Negotiation",
        value: negotiation,
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Clock,
      },
    ];
  }, [properties]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}