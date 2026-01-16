"use client";

import { useMemo } from "react";
import Link from "next/link";
// Redux import
import { useAppSelector } from "@/lib/redux/hooks";

// Icons
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  IndianRupee,
  UserCheck,
  Clock,
  CheckCircle,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";

export default function DashboardPage() {
  // Redux State Selectors
  const leads = useAppSelector((state) => state.leads.items);
  const clients = useAppSelector((state) => state.clients.items);
  const properties = useAppSelector((state) => state.properties.items);
  const deals = useAppSelector((state) => state.deals.items);
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const documents = useAppSelector((state) => state.documents.items);

  // OPTIMIZATION: Memoize statistics calculations
  const dashboardStats = useMemo(() => {
    const parseValue = (val: string) => parseFloat(val?.replace(/[₹,LakhsCr\s]/g, "") || "0");

    return {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.stage === "New Lead").length,
      totalClients: clients.length,
      vipClients: clients.filter((c) => c.status === "VIP").length,
      totalProperties: properties.length,
      availableProperties: properties.filter((p) => p.status === "Available").length,
      totalDeals: deals.length,
      closedDeals: deals.filter((d) => d.dealStage === "Closed Won").length,
      totalDealValue: deals
        .filter((d) => d.dealStage === "Closed Won")
        .reduce((sum, d) => sum + parseValue(d.dealValue), 0),
      scheduledVisits: siteVisits.filter((v) => v.status === "Scheduled").length,
      completedVisits: siteVisits.filter((v) => v.status === "Completed").length,
      activeDocuments: documents.filter((d) => d.status === "Active").length,
      pendingDocuments: documents.filter((d) => d.status === "Pending").length,
    };
  }, [leads, clients, properties, deals, siteVisits, documents]);

  // ⚡ OPTIMIZATION: Memoize Recent Activity lists
  const recentActivity = useMemo(() => ({
    leads: leads.slice(0, 5),
    deals: deals.slice(0, 5),
    visits: siteVisits.filter((v) => v.status === "Scheduled").slice(0, 5),
  }), [leads, deals, siteVisits]);

  // Configuration for Stat Cards
  const statCards = [
    {
      title: "Total Leads",
      value: dashboardStats.totalLeads,
      subtitle: `${dashboardStats.newLeads} new`,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      link: "/dashboard/leads",
    },
    {
      title: "Active Clients",
      value: dashboardStats.totalClients,
      subtitle: `${dashboardStats.vipClients} VIP`,
      icon: <UserCheck className="h-5 w-5 text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-100",
      link: "/dashboard/clients",
    },
    {
      title: "Properties",
      value: dashboardStats.totalProperties,
      subtitle: `${dashboardStats.availableProperties} avail`,
      icon: <Building2 className="h-5 w-5 text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      link: "/dashboard/properties",
    },
    {
      title: "Deals Pipeline",
      value: dashboardStats.totalDeals,
      subtitle: `${dashboardStats.closedDeals} won`,
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      bg: "bg-orange-50",
      border: "border-orange-100",
      link: "/dashboard/deals",
    },
    {
      title: "Site Visits",
      value: siteVisits.length,
      subtitle: `${dashboardStats.scheduledVisits} set`,
      icon: <Calendar className="h-5 w-5 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      link: "/dashboard/site-visits",
    },
    {
      title: "Documents",
      value: documents.length,
      subtitle: `${dashboardStats.pendingDocuments} pending`,
      icon: <FileText className="h-5 w-5 text-pink-600" />,
      bg: "bg-pink-50",
      border: "border-pink-100",
      link: "/dashboard/documents",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/leads" className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            View Leads
          </Link>
          <Link href="/dashboard/reports" className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
            Download Report
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid - Updated for compact layout (6 cols on XL screens) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.border}`}>
                {stat.icon}
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">{stat.subtitle}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-2">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Hero Metric: Total Deal Value */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-blue-100 font-medium mb-2 uppercase tracking-wide text-xs">Total Revenue (Closed)</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                ₹{dashboardStats.totalDealValue.toFixed(2)}L
              </h2>
            </div>
            <p className="text-blue-200 text-sm mt-3 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              <CheckCircle className="h-4 w-4" /> 
              Across {dashboardStats.closedDeals} successfully closed deals
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
            <IndianRupee className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>

      {/* 4. Split Layout: Recent Leads & Upcoming Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" /> Recent Leads
            </h3>
            <Link href="/dashboard/leads" className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {recentActivity.leads.length > 0 ? (
              recentActivity.leads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border
                      ${lead.stage === "New Lead" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-gray-50 text-gray-600 border-gray-100"}`}>
                      {lead.stage}
                    </span>
                    <span className="text-[10px] text-gray-400">{lead.lastContact}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">No recent leads found.</div>
            )}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" /> Upcoming Visits
            </h3>
            <Link href="/dashboard/site-visits" className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {recentActivity.visits.length > 0 ? (
              recentActivity.visits.map((visit) => (
                <div key={visit.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 group">
                  <div className="mt-1 bg-indigo-50 p-2.5 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors border border-indigo-100">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900 text-sm">{visit.leadName}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                        <Clock className="h-3 w-3" />
                        {visit.visitTime}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-medium">{visit.propertyTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">{visit.visitDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">No scheduled visits.</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Recent Deals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500" /> Recent Deal Activity
          </h3>
          <Link href="/dashboard/deals" className="text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
            Manage Deals
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentActivity.deals.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Lead / Agent</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Probability</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentActivity.deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{deal.leadName}</div>
                      <div className="text-xs text-gray-500">{deal.assignedAgent}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate font-medium" title={deal.propertyTitle}>
                      {deal.propertyTitle}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {deal.dealValue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border
                        ${deal.dealStage === 'Closed Won' ? 'bg-green-50 text-green-700 border-green-200' : 
                          deal.dealStage === 'Negotiation' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {deal.dealStage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              deal.probability >= 75 ? 'bg-green-500' : deal.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 w-8">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">No active deals found.</div>
          )}
        </div>
      </div>

      {/* 6. Quick KPI Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
           { label: "Completed Visits", value: dashboardStats.completedVisits, icon: CheckCircle, color: "text-green-600" },
           { label: "Active Documents", value: dashboardStats.activeDocuments, icon: FileText, color: "text-blue-600" },
           { 
             label: "Conversion Rate", 
             value: `${((dashboardStats.closedDeals / (dashboardStats.totalDeals || 1)) * 100).toFixed(1)}%`, 
             icon: TrendingUp, 
             color: "text-purple-600" 
           },
           { label: "Available Properties", value: dashboardStats.availableProperties, icon: Building2, color: "text-orange-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
          </div>
        ))}
      </div>
    </div>
  );
}