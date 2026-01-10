import { Home, Building2, DollarSign } from "lucide-react";
import type { Property } from "@/lib/types";

interface PropertyStatsProps {
  properties: Property[];
}

export default function PropertyStats({ properties }: PropertyStatsProps) {
  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      color: "text-blue-600",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Available",
      value: properties.filter((p) => p.status === "Available").length,
      color: "text-green-600",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Sold",
      value: properties.filter((p) => p.status === "Sold").length,
      color: "text-red-600",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Under Negotiation",
      value: properties.filter((p) => p.status === "Under Negotiation").length,
      color: "text-yellow-600",
      icon: <Home className="h-5 w-5" />,
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
