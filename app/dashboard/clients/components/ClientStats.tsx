import { useMemo } from "react";
import { Users, Star, TrendingUp, Wallet } from "lucide-react";
import type { Client } from "@/lib/types";

interface ClientStatsProps {
  clients: Client[];
}

export default function ClientStats({ clients }: ClientStatsProps) {
  
  // ⚡ OPTIMIZATION: Memoize stats
  const stats = useMemo(() => {
    const totalValue = clients.reduce((sum, client) => {
      const value = parseFloat(client.totalValue?.replace(/[₹,LakhsCr\s]/g, "") || "0");
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const formatValue = (val: number) => {
      if (val >= 100) return `₹${(val / 100).toFixed(2)} Cr`; 
      return `₹${val.toFixed(2)} L`;
    };

    return [
      {
        label: "Total Clients",
        value: clients.length,
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Users,
      },
      {
        label: "VIP Clients",
        value: clients.filter((c) => c.status === "VIP").length,
        color: "text-purple-600",
        bg: "bg-purple-50",
        icon: Star,
      },
      {
        label: "Active Clients",
        value: clients.filter((c) => c.status === "Active").length,
        color: "text-green-600",
        bg: "bg-green-50",
        icon: TrendingUp,
      },
      {
        label: "Total Portfolio Value",
        value: formatValue(totalValue),
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Wallet,
      },
    ];
  }, [clients]);

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