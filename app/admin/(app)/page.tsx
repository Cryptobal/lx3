import {
  getDashboardStats,
  getPipelineSummary,
  getRecentActivities,
  getLeadSourceStats,
} from "@/lib/growth-os/actions/dashboard";
import { StatsCards } from "@/components/growth-os/dashboard/StatsCards";
import { RecentActivity } from "@/components/growth-os/dashboard/RecentActivity";
import {
  PipelineChart,
  LeadSourceChart,
} from "@/components/growth-os/dashboard/DashboardCharts";

export default async function AdminDashboardPage() {
  let stats = { totalContacts: 0, activeDeals: 0, pipelineValue: 0, pendingQuotes: 0 };
  let pipelineData: Awaited<ReturnType<typeof getPipelineSummary>> = [];
  let activities: Awaited<ReturnType<typeof getRecentActivities>> = [];
  let leadSources: Awaited<ReturnType<typeof getLeadSourceStats>> = [];

  try {
    [stats, pipelineData, activities, leadSources] = await Promise.all([
      getDashboardStats(),
      getPipelineSummary(),
      getRecentActivities(10),
      getLeadSourceStats(),
    ]);
  } catch {
    // Data will remain at defaults
  }

  const serializedActivities = activities.map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    createdAt: a.createdAt.toISOString(),
    contact: a.contact
      ? { firstName: a.contact.firstName, lastName: a.contact.lastName }
      : null,
  }));

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
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart data={pipelineData} />
        <LeadSourceChart data={leadSources} />
      </div>

      <RecentActivity activities={serializedActivities} />
    </div>
  );
}
