// @ts-nocheck
import {
  getDashboardStats,
  getPipelineSummary,
  getRecentActivities,
  getLeadSourceBreakdown,
  getConversionFunnel,
  getRevenueMetrics,
} from "@/lib/growth-os/actions/dashboard";
import { StatsCards } from "@/components/growth-os/dashboard/StatsCards";
import { RecentActivity } from "@/components/growth-os/dashboard/RecentActivity";
import { ConversionFunnel } from "@/components/growth-os/dashboard/ConversionFunnel";
import {
  PipelineChart,
  LeadSourceChart,
} from "@/components/growth-os/dashboard/DashboardCharts";

export default async function AdminDashboardPage() {
  let stats = { totalContacts: 0, activeDeals: 0, pipelineValue: 0, pendingQuotes: 0 };
  let revenueMetrics = { wonRevenue: 0, forecastRevenue: 0, avgDealSize: 0, avgDaysToClose: 0, dealsWonThisMonth: 0, quotesAccepted: 0 };
  let pipelineData: { stageName: string; color: string; count: number; totalValue: number }[] = [];
  let activities: any[] = [];
  let leadSources: { source: string; count: number; color: string }[] = [];
  let funnelData: any[] = [];

  try {
    const [statsRes, revenueRes, pipelineRes, activitiesRes, sourcesRes, funnelRes] = await Promise.all([
      getDashboardStats(),
      getRevenueMetrics(),
      getPipelineSummary(),
      getRecentActivities(10),
      getLeadSourceBreakdown(),
      getConversionFunnel(),
    ]);
    stats = statsRes.data;
    revenueMetrics = revenueRes.data;
    pipelineData = pipelineRes.data.map((s: any) => ({
      stageName: s.name,
      color: s.color,
      count: s.count,
      totalValue: s.totalValue,
    }));
    activities = activitiesRes.data;
    leadSources = sourcesRes.data;
    funnelData = funnelRes.data;
  } catch {
    // Data will remain at defaults
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Resumen general de Growth OS
        </p>
      </div>

      <StatsCards
        totalContacts={stats.totalContacts}
        activeDeals={stats.activeDeals}
        pipelineValue={stats.pipelineValue}
        pendingQuotes={stats.pendingQuotes}
        wonRevenue={revenueMetrics.wonRevenue}
        forecastRevenue={revenueMetrics.forecastRevenue}
        avgDaysToClose={revenueMetrics.avgDaysToClose}
        quotesAccepted={revenueMetrics.quotesAccepted}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel data={funnelData} />
        <PipelineChart data={pipelineData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <LeadSourceChart data={leadSources} />
      </div>
    </div>
  );
}
