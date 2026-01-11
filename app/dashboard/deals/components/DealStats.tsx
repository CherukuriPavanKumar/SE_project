import { useMemo } from "react";
import { TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";
import { type Deal } from "@/lib/types";

interface DealStatsProps {
  deals: Deal[];
}

export default function DealStats({ deals }: DealStatsProps) {
  // ⚡ OPTIMIZATION: Memoize statistics
  const stats = useMemo(() => {
    // Helper to clean deal value string to number for calculation
    const parseValue = (val: string) => parseFloat(val?.replace(/[₹,LakhsCr\s]/g, "") || "0");
    
    // Calculate total value of closed won deals
    const totalWonValue = deals
      .filter((d) => d.dealStage === "Closed Won")
      .reduce((acc, curr) => acc + parseValue(curr.dealValue), 0);

    return [
      {
        label: "Total Deals",
        value: deals.length,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: TrendingUp,
      },
      {
        label: "Won Value",
        value: `₹${totalWonValue.toFixed(2)}L`, // Simplified formatting
        color: "text-green-600",
        bg: "bg-green-50",
        icon: DollarSign,
      },
      {
        label: "Won Deals",
        value: deals.filter((d) => d.dealStage === "Closed Won").length,
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: CheckCircle,
      },
      {
        label: "Active Pipeline",
        value: deals.filter((d) => !["Closed Won", "Closed Lost"].includes(d.dealStage)).length,
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Clock,
      },
    ];
  }, [deals]);

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