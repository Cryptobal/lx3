// @ts-nocheck
import {
  getDashboardStats,
  getPipelineSummary,
  getRecentActivities,
  getLeadSourceBreakdown,
} from "@/lib/growth-os/actions/dashboard";
import { StatsCards } from "@/components/growth-os/dashboard/StatsCards";
import { RecentActivity } from "@/components/growth-os/dashboard/RecentActivity";
import {
  PipelineChart,
  LeadSourceChart,
} from "@/components/growth-os/dashboard/DashboardCharts";

export default async function AdminDashboardPage() {
  let stats = { totalContacts: 0, activeDeals: 0, pipelineValue: 0, pendingQuotes: 0 };
  let pipelineData: { id: string; name: string; color: string; order: number; isWon: boolean; isLost: boolean; count: number; totalValue: number }[] = [];
  let activities: { id: string; type: string; title: string; description: string | null; createdAt: string; contact: { firstName: string; lastName: string } | null }[] = [];
  let leadSources: { source: string; count: number; color: string }[] = [];

  try {
    const [statsRes, pipelineRes, activitiesRes, sourcesRes] = await Promise.all([
      getDashboardStats(),
      getPipelineSummary(),
      getRecentActivities(10),
      getLeadSourceBreakdown(),
    ]);
    stats = statsRes.data;
    pipelineData = pipelineRes.data;
    activities = activitiesRes.data;
    leadSources = sourcesRes.data;
  } catch {
    // Data will remain at defaults
  }

  const serializedActivities = activities;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Resumen general de Growth OS
        </p>
      </div>

      <StatsCards
        totalContacts={stats.totalContacts}
        activeDeals={stats.activeDeals}
        pipelineValue={stats.pipelineValue}
        pendingQuotes={stats.pendingQuotes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart data={pipelineData.map((s) => ({ stageName: s.name, color: s.color, count: s.count, totalValue: s.totalValue }))} />
        <LeadSourceChart data={leadSources} />
      </div>

      <RecentActivity activities={serializedActivities} />
    </div>
  );
}