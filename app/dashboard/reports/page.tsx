"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectReportMetrics } from "@/lib/redux/slices/reportSlice";

import ReportHeader from "./components/ReportHeader";
import KeyMetrics from "./components/KeyMetrics";
import DealPipelineChart from "./components/DealPipelineChart";
import LeadFunnelChart from "./components/LeadFunnelChart";
import AgentPerformanceTable from "./components/AgentPerformanceTable";
import AdditionalMetrics from "./components/AdditionalMetrics";

export default function ReportsPage() {
  const metrics = useAppSelector(selectReportMetrics);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <ReportHeader />

      <KeyMetrics metrics={metrics} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DealPipelineChart metrics={metrics} />
        <LeadFunnelChart metrics={metrics} />
      </div>

      <AgentPerformanceTable agents={metrics.agentPerformance} />

      <AdditionalMetrics metrics={metrics} />
    </div>
  );
}