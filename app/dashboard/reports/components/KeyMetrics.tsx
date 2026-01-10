import { TrendingUp, DollarSign, Target, Users, Home, Activity, BarChart3 } from "lucide-react";
import type { ReportMetrics } from "@/lib/types";

interface KeyMetricsProps {
  metrics: ReportMetrics;
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      subtitle: `From ${metrics.wonDeals} closed deals`,
      icon: <DollarSign className="h-8 w-8 opacity-80" />,
      trendIcon: <TrendingUp className="h-5 w-5" />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      subtitle: `${metrics.totalLeads} leads processed`,
      icon: <Target className="h-8 w-8 opacity-80" />,
      trendIcon: <Activity className="h-5 w-5" />,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients,
      subtitle: "High engagement rate",
      icon: <Users className="h-8 w-8 opacity-80" />,
      trendIcon: <TrendingUp className="h-5 w-5" />,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Properties",
      value: metrics.totalProperties,
      subtitle: `Avg: ${formatCurrency(metrics.averagePropertyValue)}`,
      icon: <Home className="h-8 w-8 opacity-80" />,
      trendIcon: <BarChart3 className="h-5 w-5" />,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {keyMetrics.map((metric) => (
        <div
          key={metric.title}
          className={`bg-gradient-to-br ${metric.gradient} rounded-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between mb-4">
            {metric.icon}
            {metric.trendIcon}
          </div>
          <p className="text-sm opacity-90">{metric.title}</p>
          <p className="text-3xl font-bold mt-1">{metric.value}</p>
          <p className="text-xs opacity-80 mt-2">{metric.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
