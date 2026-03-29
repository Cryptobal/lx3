import {
  getDashboardStats,
  getPipelineSummary,
  getRecentActivities,
  getLeadSourceBreakdown,
} from "@/lib/growth-os/actions/dashboard";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { StatsCards } from "@/components/growth-os/dashboard/StatsCards";
import { PipelineChart } from "@/components/growth-os/dashboard/PipelineChart";
import { RecentActivity } from "@/components/growth-os/dashboard/RecentActivity";
import { LeadSourceChart } from "@/components/growth-os/dashboard/LeadSourceChart";

export default async function DashboardPage() {
  const [statsResult, pipelineResult, activitiesResult, sourcesResult] =
    await Promise.all([
      getDashboardStats(),
      getPipelineSummary(),
      getRecentActivities(10),
      getLeadSourceBreakdown(),
    ]);

  const stats = statsResult.data;
  const pipeline = pipelineResult.data;
  const activities = activitiesResult.data;
  const sources = sourcesResult.data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general de Growth OS"
      />

      <StatsCards
        totalContacts={stats.totalContacts}
        activeDeals={stats.activeDeals}
        pipelineValue={stats.pipelineValue}
        pendingQuotes={stats.pendingQuotes}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pipeline chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Pipeline por Etapa
          </h2>
          <PipelineChart data={pipeline} />
        </div>

        {/* Lead sources */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">
            Fuentes de Leads
          </h2>
          <LeadSourceChart data={sources} />
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Actividad Reciente
        </h2>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
