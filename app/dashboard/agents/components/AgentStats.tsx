import { UserCog, Users, Award, CheckCircle } from "lucide-react";
import type { Agent } from "@/lib/types";

interface AgentStatsProps {
  agents: Agent[];
}

export default function AgentStats({ agents }: AgentStatsProps) {
  const stats = [
    {
      label: "Total Agents",
      value: agents.length,
      color: "text-blue-600",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      label: "Employees",
      value: agents.filter((a) => a.role === "Employee").length,
      color: "text-green-600",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Brokers",
      value: agents.filter((a) => a.role === "Broker").length,
      color: "text-purple-600",
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: "Active",
      value: agents.filter((a) => a.status === "Active").length,
      color: "text-orange-600",
      icon: <CheckCircle className="h-5 w-5" />,
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
