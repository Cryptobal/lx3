import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";

export const metadata = { title: "Emails Enviados | Growth OS" };

const statusConfig: Record<string, { label: string; color: string }> = {
  QUEUED: { label: "En cola", color: "gray" },
  SENT: { label: "Enviado", color: "blue" },
  DELIVERED: { label: "Entregado", color: "green" },
  OPENED: { label: "Abierto", color: "#10b981" },
  CLICKED: { label: "Clic", color: "#8b5cf6" },
  BOUNCED: { label: "Rebotado", color: "red" },
  FAILED: { label: "Fallido", color: "red" },
};

export default async function EmailsPage() {
  const emails = await getEmailLogs();

  return (
    <>
      <PageHeader
        title="Emails Enviados"
        description="Registro de todos los emails enviados desde Growth OS"
      />

      {emails.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
          <p className="text-sm text-gray-500">No hay emails registrados</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Destinatario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Asunto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Enviado por
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha envio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Apertura
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {emails.map((email: any) => {
                  const cfg = statusConfig[email.status] ?? statusConfig.QUEUED;
                  return (
                    <tr
                      key={email.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {email.toAddress}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-700">
                        {email.subject}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge label={cfg.label} color={cfg.color} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {email.sentBy?.name ?? "Sistema"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <RelativeTime date={email.sentAt ?? email.createdAt} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {email.openedAt ? (
                          <RelativeTime date={email.openedAt} />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

async function getEmailLogs() {
  if (!prisma) return [];

  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        sentBy: { select: { id: true, name: true } },
      },
    });

    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    console.error("getEmailLogs error:", error);
    return [];
  }
}
