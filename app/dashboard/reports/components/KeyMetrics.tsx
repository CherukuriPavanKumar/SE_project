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
      subtitle: "vs last month",
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12.5%",
      trendColor: "text-green-600 bg-green-50",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      subtitle: "vs last month",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "+4.2%",
      trendColor: "text-green-600 bg-green-50",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients,
      subtitle: "vs last month",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+8.1%",
      trendColor: "text-green-600 bg-green-50",
    },
    {
      title: "Portfolio Value",
      value: formatCurrency(metrics.totalProperties * metrics.averagePropertyValue),
      subtitle: "vs last month",
      icon: Home,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+2.4%",
      trendColor: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {keyMetrics.map((metric) => (
        <div key={metric.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${metric.bg} group-hover:scale-110 transition-transform duration-200`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${metric.trendColor}`}>
              <TrendingUp className="h-3 w-3" />
              {metric.trend}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{metric.value}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <span className="text-xs text-gray-400">• {metric.subtitle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}