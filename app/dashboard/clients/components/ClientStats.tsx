import { Users, Star, TrendingUp, CreditCard } from "lucide-react";
import type { Client } from "@/lib/types";

interface ClientStatsProps {
  clients: Client[];
}

export default function ClientStats({ clients }: ClientStatsProps) {
  const totalValue = clients.reduce((sum, client) => {
    const value = client.totalValue.replace(/[₹,\s]/g, "");
    const numValue = parseFloat(value);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);

  const formatValue = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    }
    return `₹${value}`;
  };

  const stats = [
    {
      label: "Total Clients",
      value: clients.length,
      color: "text-blue-600",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "VIP Clients",
      value: clients.filter((c) => c.status === "VIP").length,
      color: "text-purple-600",
      icon: <Star className="h-5 w-5" />,
    },
    {
      label: "Active Clients",
      value: clients.filter((c) => c.status === "Active").length,
      color: "text-green-600",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Total Value",
      value: formatValue(totalValue),
      color: "text-orange-600",
      icon: <CreditCard className="h-5 w-5" />,
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
