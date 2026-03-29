// @ts-nocheck
import { Eye, Users, Monitor } from "lucide-react";
import { prisma } from "@/lib/db";
import { VisitorsList } from "@/components/growth-os/tracking/VisitorsList";
import { EmptyState } from "@/components/growth-os/shared/EmptyState";

async function getTrackingData() {
  if (!prisma) return { sessions: [], todaySessions: 0, uniqueVisitors: 0, totalPageViews: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [sessions, todaySessions, uniqueVisitors, totalPageViews] = await Promise.all([
    prisma.visitorSession.findMany({
      include: {
        pageViews: {
          orderBy: { viewedAt: "asc" },
        },
        contact: true,
      },
      orderBy: { startedAt: "desc" },
      take: 50,
    }),
    prisma.visitorSession.count({
      where: { startedAt: { gte: todayStart } },
    }),
    prisma.visitorSession.findMany({
      where: { startedAt: { gte: todayStart } },
      distinct: ["visitorId"],
      select: { visitorId: true },
    }).then((r) => r.length),
    prisma.pageView.count({
      where: { viewedAt: { gte: todayStart } },
    }),
  ]);

  return { sessions, todaySessions, uniqueVisitors, totalPageViews };
}

export default async function TrackingPage() {
  let data = {
    sessions: [] as Awaited<ReturnType<typeof getTrackingData>>["sessions"],
    todaySessions: 0,
    uniqueVisitors: 0,
    totalPageViews: 0,
  };

  try {
    data = await getTrackingData();
  } catch {
    // Data will remain at defaults
  }

  const serializedSessions = data.sessions.map((session) => ({
    id: session.id,
    visitorId: session.visitorId,
    deviceType: session.deviceType,
    referrer: session.referrer,
    utmSource: session.utmSource,
    country: session.country,
    city: session.city,
    pageCount: session.pageViews.length,
    startedAt: session.startedAt.toISOString(),
    endedAt: null as string | null,
    contact: session.contact
      ? {
          id: session.contact.id,
          firstName: session.contact.firstName,
          lastName: session.contact.lastName,
        }
      : null,
    pageViews: session.pageViews.map((pv) => ({
      id: pv.id,
      path: pv.path,
      title: pv.title,
      duration: pv.duration,
      scrollDepth: pv.scrollDepth,
      viewedAt: pv.viewedAt.toISOString(),
    })),
  }));

  const stats = [
    {
      label: "Sesiones hoy",
      value: data.todaySessions,
      icon: Monitor,
    },
    {
      label: "Visitantes únicos",
      value: data.uniqueVisitors,
      icon: Users,
    },
    {
      label: "Páginas vistas",
      value: data.totalPageViews,
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Tracking de Visitantes
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monitorea visitas y actividad en tu sitio web
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800">
                  <Icon className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sessions list */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-100">
            Sesiones recientes
          </h2>
        </div>
        {serializedSessions.length === 0 ? (
          <EmptyState
            icon={Monitor}
            title="Sin sesiones recientes"
            description="Las sesiones de visitantes aparecerán aquí cuando se detecten visitas en tu sitio."
          />
        ) : (
          <VisitorsList sessions={serializedSessions} />
        )}
      </div>
    </div>
  );
}