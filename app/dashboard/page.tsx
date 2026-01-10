"use client";

// ❌ OLD: Context imports
// import { useLeads } from "@/lib/contexts/LeadContext";
// import { useClients } from "@/lib/contexts/ClientContext";
// import { useProperties } from "@/lib/contexts/PropertyContext";
// import { useDeals } from "@/lib/contexts/DealContext";
// import { useSiteVisits } from "@/lib/contexts/SiteVisitContext";
// import { useDocuments } from "@/lib/contexts/DocumentContext";

// ✅ NEW: Redux import
import { useAppSelector } from "@/lib/redux/hooks";

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
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const leads = useAppSelector((state) => state.leads.items);
  const clients = useAppSelector((state) => state.clients.items);
  const properties = useAppSelector((state) => state.properties.items);
  const deals = useAppSelector((state) => state.deals.items);
  const siteVisits = useAppSelector((state) => state.siteVisits.items);
  const documents = useAppSelector((state) => state.documents.items);

  // Calculate statistics (stays exactly the same!)
  const stats = {
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
      .reduce((sum, d) => {
        const value = parseFloat(d.dealValue.replace(/[₹,LakhsCr]/g, ""));
        return sum + value;
      }, 0),
    scheduledVisits: siteVisits.filter((v) => v.status === "Scheduled").length,
    completedVisits: siteVisits.filter((v) => v.status === "Completed").length,
    activeDocuments: documents.filter((d) => d.status === "Active").length,
    pendingDocuments: documents.filter((d) => d.status === "Pending").length,
  };

  // Recent activities
  const recentLeads = leads.slice(0, 5);
  const recentDeals = deals.slice(0, 5);
  const upcomingVisits = siteVisits
    .filter((v) => v.status === "Scheduled")
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      subtitle: `${stats.newLeads} new`,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50",
      link: "/dashboard/leads",
    },
    {
      title: "Active Clients",
      value: stats.totalClients,
      subtitle: `${stats.vipClients} VIP`,
      icon: <UserCheck className="h-8 w-8 text-green-600" />,
      color: "bg-green-50",
      link: "/dashboard/clients",
    },
    {
      title: "Properties",
      value: stats.totalProperties,
      subtitle: `${stats.availableProperties} available`,
      icon: <Building2 className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50",
      link: "/dashboard/properties",
    },
    {
      title: "Deals",
      value: stats.totalDeals,
      subtitle: `${stats.closedDeals} closed`,
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50",
      link: "/dashboard/deals",
    },
    {
      title: "Site Visits",
      value: siteVisits.length,
      subtitle: `${stats.scheduledVisits} scheduled`,
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-50",
      link: "/dashboard/site-visits",
    },
    {
      title: "Documents",
      value: documents.length,
      subtitle: `${stats.pendingDocuments} pending`,
      icon: <FileText className="h-8 w-8 text-pink-600" />,
      color: "bg-pink-50",
      link: "/dashboard/documents",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Deal Value Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Deal Value (Closed)</p>
              <p className="text-4xl font-bold mt-2">₹{stats.totalDealValue.toFixed(2)}L</p>
              <p className="text-blue-100 text-sm mt-1">{stats.closedDeals} deals closed</p>
            </div>
            <IndianRupee className="h-16 w-16 text-blue-200 opacity-50" />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                <Link
                  href="/dashboard/leads"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentLeads.length > 0 ? (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {lead.stage}
                          </span>
                          <span className="text-xs text-gray-500">{lead.budget}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{lead.lastContact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No leads yet</p>
              )}
            </div>
          </div>

          {/* Upcoming Site Visits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Site Visits</h2>
                <Link
                  href="/dashboard/site-visits"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {upcomingVisits.length > 0 ? (
                <div className="space-y-4">
                  {upcomingVisits.map((visit) => (
                    <div key={visit.id} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                      <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{visit.leadName}</p>
                        <p className="text-sm text-gray-600 mt-1">{visit.propertyTitle}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {visit.visitDate} at {visit.visitTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming visits</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Deals</h2>
              <Link
                href="/dashboard/deals"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentDeals.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lead Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Deal Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Probability
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{deal.leadName}</p>
                          <p className="text-sm text-gray-500">{deal.assignedAgent}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {deal.propertyTitle.substring(0, 40)}...
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {deal.dealValue}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            deal.dealStage === "Closed Won"
                              ? "bg-green-100 text-green-800"
                              : deal.dealStage === "Negotiation"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {deal.dealStage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                deal.probability >= 75
                                  ? "bg-green-500"
                                  : deal.probability >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${deal.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{deal.probability}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-8">No deals yet</p>
            )}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.completedVisits}</p>
            <p className="text-sm text-gray-600">Completed Visits</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.activeDocuments}</p>
            <p className="text-sm text-gray-600">Active Documents</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {((stats.closedDeals / stats.totalDeals) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Building2 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.availableProperties}</p>
            <p className="text-sm text-gray-600">Available Properties</p>
          </div>
        </div>
      </main>
    </div>
  );
}