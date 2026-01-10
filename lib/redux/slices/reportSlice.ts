import { createSlice, createSelector } from '@reduxjs/toolkit';
import { mockMonthlyRevenue, mockMonthlyDeals } from '@/lib/mock-data';
import type { RootState } from '../store';

interface ReportState {
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyDeals: { month: string; deals: number }[];
}

const initialState: ReportState = {
  monthlyRevenue: mockMonthlyRevenue,
  monthlyDeals: mockMonthlyDeals,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // You can add actions later if needed
    updateMonthlyData: (state, action) => {
      state.monthlyRevenue = action.payload.revenue;
      state.monthlyDeals = action.payload.deals;
    },
  },
});

// ============================================
// SELECTORS - Calculate metrics from state
// ============================================

// Helper function to parse currency
const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[₹,Lakhs Cr]/g, "").trim();
  if (value.includes("Cr")) {
    return parseFloat(cleanValue) * 10000000;
  } else if (value.includes("Lakhs")) {
    return parseFloat(cleanValue) * 100000;
  }
  return parseFloat(cleanValue) || 0;
};

// Base selectors
const selectLeads = (state: RootState) => state.leads.items;
const selectClients = (state: RootState) => state.clients.items;
const selectProperties = (state: RootState) => state.properties.items;
const selectDeals = (state: RootState) => state.deals.items;
const selectSiteVisits = (state: RootState) => state.siteVisits.items;
const selectDocuments = (state: RootState) => state.documents.items;
const selectMonthlyRevenue = (state: RootState) => state.reports.monthlyRevenue;
const selectMonthlyDeals = (state: RootState) => state.reports.monthlyDeals;

// Calculated selectors (memoized)
export const selectTotalRevenue = createSelector(
  [selectDeals],
  (deals) => deals
    .filter((d) => d.dealStage === "Closed Won")
    .reduce((sum, d) => sum + parseCurrency(d.dealValue), 0)
);

export const selectWonDeals = createSelector(
  [selectDeals],
  (deals) => deals.filter((d) => d.dealStage === "Closed Won").length
);

export const selectLostDeals = createSelector(
  [selectDeals],
  (deals) => deals.filter((d) => d.dealStage === "Closed Lost").length
);

export const selectLeadsByStage = createSelector(
  [selectLeads],
  (leads) => {
    const stages = Array.from(new Set(leads.map((l) => l.stage)));
    return stages.map((stage) => ({
      stage,
      count: leads.filter((l) => l.stage === stage).length,
    }));
  }
);

export const selectLeadConversionRate = createSelector(
  [selectLeads],
  (leads) => {
    const convertedLeads = leads.filter((l) => l.stage === "Closed").length;
    return leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;
  }
);

export const selectPropertiesByStatus = createSelector(
  [selectProperties],
  (properties) => {
    const statuses = Array.from(new Set(properties.map((p) => p.status)));
    return statuses.map((status) => ({
      status,
      count: properties.filter((p) => p.status === status).length,
    }));
  }
);

export const selectPropertiesByType = createSelector(
  [selectProperties],
  (properties) => {
    const types = Array.from(new Set(properties.map((p) => p.type)));
    return types.map((type) => ({
      type,
      count: properties.filter((p) => p.type === type).length,
    }));
  }
);

export const selectAveragePropertyValue = createSelector(
  [selectProperties],
  (properties) => {
    const totalValue = properties.reduce((sum, p) => sum + parseCurrency(p.price), 0);
    return properties.length > 0 ? totalValue / properties.length : 0;
  }
);

export const selectDealsByStage = createSelector(
  [selectDeals],
  (deals) => {
    const stages = Array.from(new Set(deals.map((d) => d.dealStage)));
    return stages.map((stage) => {
      const stageDeals = deals.filter((d) => d.dealStage === stage);
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + parseCurrency(d.dealValue), 0),
      };
    });
  }
);

export const selectTotalDealValue = createSelector(
  [selectDeals],
  (deals) => deals.reduce((sum, d) => sum + parseCurrency(d.dealValue), 0)
);

export const selectAverageDealSize = createSelector(
  [selectDeals, selectTotalDealValue],
  (deals, totalValue) => (deals.length > 0 ? totalValue / deals.length : 0)
);

export const selectVisitsByStatus = createSelector(
  [selectSiteVisits],
  (visits) => {
    const statuses = Array.from(new Set(visits.map((v) => v.status)));
    return statuses.map((status) => ({
      status,
      count: visits.filter((v) => v.status === status).length,
    }));
  }
);

export const selectUpcomingVisits = createSelector(
  [selectSiteVisits],
  (visits) => visits.filter((v) => v.status === "Scheduled").length
);

export const selectCompletedVisits = createSelector(
  [selectSiteVisits],
  (visits) => visits.filter((v) => v.status === "Completed").length
);

export const selectDocumentsByType = createSelector(
  [selectDocuments],
  (documents) => {
    const types = Array.from(new Set(documents.map((d) => d.documentType)));
    return types.map((type) => ({
      type,
      count: documents.filter((d) => d.documentType === type).length,
    }));
  }
);

export const selectDocumentsByStatus = createSelector(
  [selectDocuments],
  (documents) => {
    const statuses = Array.from(new Set(documents.map((d) => d.status)));
    return statuses.map((status) => ({
      status,
      count: documents.filter((d) => d.status === status).length,
    }));
  }
);

export const selectActiveClients = createSelector(
  [selectClients],
  (clients) => clients.filter((c) => c.status === "Active" || c.status === "VIP").length
);

export const selectAgentPerformance = createSelector(
  [selectLeads, selectDeals],
  (leads, deals) => {
    const agents = Array.from(
      new Set([
        ...leads.map((l) => l.assignedTo),
        ...deals.map((d) => d.assignedAgent),
      ])
    );

    return agents.map((agent) => {
      const agentLeads = leads.filter((l) => l.assignedTo === agent);
      const agentDeals = deals.filter((d) => d.assignedAgent === agent);
      const agentRevenue = agentDeals
        .filter((d) => d.dealStage === "Closed Won")
        .reduce((sum, d) => sum + parseCurrency(d.dealValue), 0);
      const convertedLeads = agentLeads.filter((l) => l.stage === "Closed").length;
      const conversionRate = agentLeads.length > 0
        ? Math.round((convertedLeads / agentLeads.length) * 100)
        : 0;

      return {
        name: agent,
        leads: agentLeads.length,
        deals: agentDeals.filter((d) => d.dealStage === "Closed Won").length,
        revenue: agentRevenue,
        conversionRate,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }
);

// Monthly data with current month updated
// FIX: Add type annotation for 'item' parameter
export const selectMonthlyRevenueData = createSelector(
  [selectMonthlyRevenue, selectTotalRevenue],
  (monthlyRevenue, currentRevenue) => {
    return monthlyRevenue.map((item: { month: string; revenue: number }, index: number) => {
      if (index === monthlyRevenue.length - 1) {
        return { ...item, revenue: currentRevenue };
      }
      return item;
    });
  }
);

// FIX: Add type annotation for 'item' parameter
export const selectMonthlyDealsData = createSelector(
  [selectMonthlyDeals, selectWonDeals],
  (monthlyDeals, currentDeals) => {
    return monthlyDeals.map((item: { month: string; deals: number }, index: number) => {
      if (index === monthlyDeals.length - 1) {
        return { ...item, deals: currentDeals };
      }
      return item;
    });
  }
);

// Main selector - combines all metrics
export const selectReportMetrics = createSelector(
  [
    selectLeads,
    selectClients,
    selectProperties,
    selectDeals,
    selectSiteVisits,
    selectDocuments,
    selectTotalRevenue,
    selectLeadsByStage,
    selectLeadConversionRate,
    selectPropertiesByStatus,
    selectPropertiesByType,
    selectAveragePropertyValue,
    selectDealsByStage,
    selectTotalDealValue,
    selectAverageDealSize,
    selectWonDeals,
    selectLostDeals,
    selectVisitsByStatus,
    selectUpcomingVisits,
    selectCompletedVisits,
    selectDocumentsByType,
    selectDocumentsByStatus,
    selectActiveClients,
    selectAgentPerformance,
    selectMonthlyRevenueData,
    selectMonthlyDealsData,
  ],
  (
    leads,
    clients,
    properties,
    deals,
    siteVisits,
    documents,
    totalRevenue,
    leadsByStage,
    leadConversionRate,
    propertiesByStatus,
    propertiesByType,
    averagePropertyValue,
    dealsByStage,
    totalDealValue,
    averageDealSize,
    wonDeals,
    lostDeals,
    visitsByStatus,
    upcomingVisits,
    completedVisits,
    documentsByType,
    documentsByStatus,
    activeClients,
    agentPerformance,
    monthlyRevenue,
    monthlyDeals
  ) => ({
    totalRevenue,
    totalDeals: deals.length,
    activeClients,
    conversionRate: leadConversionRate,
    totalLeads: leads.length,
    leadsByStage,
    leadConversionRate,
    totalProperties: properties.length,
    propertiesByStatus,
    propertiesByType,
    averagePropertyValue,
    dealsByStage,
    totalDealValue,
    averageDealSize,
    wonDeals,
    lostDeals,
    totalSiteVisits: siteVisits.length,
    visitsByStatus,
    upcomingVisits,
    completedVisits,
    totalDocuments: documents.length,
    documentsByType,
    documentsByStatus,
    agentPerformance,
    monthlyRevenue,
    monthlyDeals,
  })
);

export const { updateMonthlyData } = reportSlice.actions;
export default reportSlice.reducer;