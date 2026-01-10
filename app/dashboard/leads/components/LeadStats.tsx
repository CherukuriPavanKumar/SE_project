import type { Lead } from "@/lib/types";

interface LeadStatsProps {
  leads: Lead[];
}

export default function LeadStats({ leads }: LeadStatsProps) {
  const stats = [
    { label: "Total Leads", value: leads.length, color: "text-blue-600" },
    {
      label: "Hot Leads",
      value: leads.filter((l) => l.stage === "Negotiation").length,
      color: "text-green-600",
    },
    {
      label: "Warm Leads",
      value: leads.filter((l) => l.stage === "Contacted").length,
      color: "text-yellow-600",
    },
    { label: "Conversion Rate", value: "32%", color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">{stat.label}</p>
          <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
