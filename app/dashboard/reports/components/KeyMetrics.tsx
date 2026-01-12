import { TrendingUp, DollarSign, Target, Users, Home } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface KeyMetricsProps {
  metrics: ReportMetrics;
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      subtitle: `${metrics.wonDeals} deals closed this month`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      subtitle: `From ${metrics.totalLeads} total leads`,
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "+5%",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients,
      subtitle: "Currently engaged in deals",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+8%",
    },
    {
      title: "Portfolio Value",
      value: formatCurrency(metrics.totalProperties * metrics.averagePropertyValue),
      subtitle: `${metrics.totalProperties} properties listed`,
      icon: Home,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {keyMetrics.map((metric) => (
        <div key={metric.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-lg ${metric.bg}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              {metric.trend}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{metric.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
            <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}