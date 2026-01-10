import { TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";
import { type Deal } from "@/lib/mock-data";

interface DealStatsProps {
  deals: Deal[];
}

export default function DealStats({ deals }: DealStatsProps) {
  const stats = [
    {
      label: "Total Deals",
      value: deals.length,
      color: "text-blue-600",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Total Value",
      value: "₹12.5 Cr",
      color: "text-green-600",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Won Deals",
      value: deals.filter((d) => d.dealStage === "Closed Won").length,
      color: "text-purple-600",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Active Deals",
      value: deals.filter((d) => !["Closed Won", "Closed Lost"].includes(d.dealStage)).length,
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
