import { useMemo } from "react";
import { Users, Flame, ThermometerSun, PieChart } from "lucide-react";
import type { Lead } from "@/lib/types";

interface LeadStatsProps {
  leads: Lead[];
}

export default function LeadStats({ leads }: LeadStatsProps) {
  // ⚡ OPTIMIZATION: Memoize stats to prevent recalculation on every render
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.stage === "Negotiation" || l.stage === "Site Visit Scheduled").length;
    const warm = leads.filter((l) => l.stage === "Contacted").length;
    const closed = leads.filter((l) => l.stage === "Closed").length;
    
    // Calculate dynamic conversion rate
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : "0.0";

    return [
      { 
        label: "Total Leads", 
        value: total, 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        icon: Users 
      },
      { 
        label: "Hot Leads", 
        value: hot, 
        color: "text-red-600", 
        bg: "bg-red-50",
        icon: Flame 
      },
      { 
        label: "Warm Leads", 
        value: warm, 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        icon: ThermometerSun 
      },
      { 
        label: "Conversion Rate", 
        value: `${conversionRate}%`, 
        color: "text-green-600", 
        bg: "bg-green-50",
        icon: PieChart 
      },
    ];
  }, [leads]);

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