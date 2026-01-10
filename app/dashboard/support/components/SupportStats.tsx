import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface SupportStatsProps {
  stats: {
    total: number;
    new: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  };
}

export default function SupportStats({ stats }: SupportStatsProps) {
  const statCards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: <Ticket className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "New",
      value: stats.new,
      icon: <Clock className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Urgent",
      value: stats.urgent,
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <div className={`${stat.bgColor} p-2 rounded-lg`}>
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </div>
          <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
