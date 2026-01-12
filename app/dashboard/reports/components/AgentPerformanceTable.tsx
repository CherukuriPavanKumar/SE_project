import { Award, Trophy, Medal } from "lucide-react";
import type { AgentPerformance } from "@/lib/types";

interface AgentPerformanceTableProps {
  agents: AgentPerformance[];
}

export default function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (index === 2) return <Medal className="h-4 w-4 text-orange-400" />;
    return <span className="text-gray-400 font-mono text-xs w-4 text-center">{index + 1}</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Agent Performance</h3>
          <p className="text-sm text-gray-500">Top contributors this month</p>
        </div>
        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
          <Award className="h-5 w-5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500">
            <tr>
              <th className="px-6 py-4 w-16 text-center">Rank</th>
              <th className="px-6 py-4">Agent Name</th>
              <th className="px-6 py-4 text-center">Leads</th>
              <th className="px-6 py-4 text-center">Deals</th>
              <th className="px-6 py-4 text-right">Revenue</th>
              <th className="px-6 py-4 text-center">Conversion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map((agent, index) => (
              <tr key={agent.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center h-8 w-8 bg-white border border-gray-100 rounded-full mx-auto shadow-sm">
                    {getRankIcon(index)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{agent.name}</p>
                      {index === 0 && <span className="text-[10px] text-green-600 font-medium">Top Performer</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md font-medium text-xs">
                    {agent.leads}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-900">
                  {agent.deals}
                </td>
                <td className="px-6 py-4 text-right font-mono font-medium text-gray-700">
                  {formatCurrency(agent.revenue)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${agent.conversionRate >= 50 ? 'bg-green-500' : 'bg-orange-500'}`} 
                        style={{ width: `${agent.conversionRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{agent.conversionRate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}