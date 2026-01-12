import { useMemo } from "react";
import { UserCog, Users, Award, CheckCircle } from "lucide-react";
import type { Agent } from "@/lib/types";

interface AgentStatsProps {
  agents: Agent[];
}

export default function AgentStats({ agents }: AgentStatsProps) {
  
  // OPTIMIZATION: Memoize stats
  const stats = useMemo(() => [
    {
      label: "Total Agents",
      value: agents.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: UserCog,
    },
    {
      label: "Employees",
      value: agents.filter((a) => a.role === "Employee").length,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: Users,
    },
    {
      label: "Brokers",
      value: agents.filter((a) => a.role === "Broker").length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: Award,
    },
    {
      label: "Active Agents",
      value: agents.filter((a) => a.status === "Active").length,
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: CheckCircle,
    },
  ], [agents]);

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