import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { VisitorsList } from "@/components/growth-os/tracking/VisitorsList";

export const metadata = { title: "Tracking de Visitantes | Growth OS" };

export default async function TrackingPage() {
  const sessions = await getRecentSessions();

  return (
    <>
      <PageHeader
        title="Tracking de Visitantes"
        description="Sesiones recientes de visitantes en el sitio"
      />
      <VisitorsList sessions={sessions} />
    </>
  );
}

async function getRecentSessions() {
  if (!prisma) return [];

  try {
    const sessions = await prisma.visitorSession.findMany({
      orderBy: { startedAt: "desc" },
      take: 50,
      include: {
        contact: {
          select: { id: true, firstName: true, lastName: true },
        },
        pageViews: {
          orderBy: { viewedAt: "asc" },
        },
      },
    });

    return JSON.parse(JSON.stringify(sessions));
  } catch (error) {
    console.error("getRecentSessions error:", error);
    return [];
  }
}
