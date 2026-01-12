import { useMemo } from "react";
import { Ticket, Clock, CheckCircle, AlertCircle, Inbox } from "lucide-react";
import type { SupportTicket } from "@/lib/types";

interface SupportStatsProps {
  tickets: SupportTicket[];
}

export default function SupportStats({ tickets }: SupportStatsProps) {
  
  // OPTIMIZATION: Memoize stats calculation
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      new: tickets.filter((t) => t.status === "New").length,
      open: tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length,
      urgent: tickets.filter((t) => t.priority === "Urgent" && t.status !== "Closed").length,
    };
  }, [tickets]);

  const statCards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: Ticket,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "New",
      value: stats.new,
      icon: Inbox,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Open / In Progress",
      value: stats.open,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Urgent",
      value: stats.urgent,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
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