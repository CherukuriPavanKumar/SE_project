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

    // Calculate a dummy "Active Value" based on available properties (just for display)
    const activeValue = available * 1.5; // Assuming avg 1.5Cr per property

    return [
      {
        label: "Total Listings",
        value: total,
        subtext: "Across all locations",
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Home,
      },
      {
        label: "Available",
        value: available,
        subtext: `~₹${activeValue.toFixed(1)} Cr Value`,
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle2,
      },
      {
        label: "Sold Properties",
        value: sold,
        subtext: "This Year",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        icon: Building2,
      },
      {
        label: "In Negotiation",
        value: negotiation,
        subtext: "Hot Leads",
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Clock,
      },
    ];
  }, [properties]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 group cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-1">{stat.subtext}</p>
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