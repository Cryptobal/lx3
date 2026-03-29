"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  User,
  Clock,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/growth-os/shared/Badge";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";

interface PageView {
  id: string;
  path: string;
  title: string | null;
  duration: number | null;
  scrollDepth: number | null;
  viewedAt: string;
}

interface Session {
  id: string;
  visitorId: string;
  deviceType: string | null;
  referrer: string | null;
  utmSource: string | null;
  country: string | null;
  city: string | null;
  pageCount: number;
  startedAt: string;
  endedAt: string | null;
  contact: {
    id: string;
    firstName: string;
    lastName: string | null;
  } | null;
  pageViews: PageView[];
}

interface VisitorsListProps {
  sessions: Session[];
}

const deviceIcons: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === 0) return "-";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function getSessionDuration(session: Session): number | null {
  if (!session.endedAt) return null;
  const start = new Date(session.startedAt).getTime();
  const end = new Date(session.endedAt).getTime();
  return Math.round((end - start) / 1000);
}

function getSourceLabel(session: Session): string {
  if (session.utmSource) return session.utmSource;
  if (session.referrer) {
    try {
      return new URL(session.referrer).hostname;
    } catch {
      return session.referrer;
    }
  }
  return "Directo";
}

export function VisitorsList({ sessions }: VisitorsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Eye className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Sin sesiones recientes
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Las sesiones de visitantes apareceran aqui cuando el pixel de tracking
          este activo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-4 py-3" />
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Visitante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Paginas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Duracion
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dispositivo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Fuente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Pais
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => {
              const isExpanded = expandedId === session.id;
              const DeviceIcon =
                deviceIcons[session.deviceType ?? "desktop"] ?? Monitor;

              return (
                <SessionRow
                  key={session.id}
                  session={session}
                  isExpanded={isExpanded}
                  DeviceIcon={DeviceIcon}
                  onToggle={() =>
                    setExpandedId(isExpanded ? null : session.id)
                  }
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SessionRow({
  session,
  isExpanded,
  DeviceIcon,
  onToggle,
}: {
  session: Session;
  isExpanded: boolean;
  DeviceIcon: typeof Monitor;
  onToggle: () => void;
}) {
  const duration = getSessionDuration(session);

  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer transition-colors hover:bg-gray-50"
      >
        <td className="px-4 py-3 text-gray-400">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm">
          {session.contact ? (
            <a
              href={`/admin/contacts/${session.contact.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-blue-600 hover:underline"
            >
              <User className="mr-1 inline h-3.5 w-3.5" />
              {session.contact.firstName}{" "}
              {session.contact.lastName ?? ""}
            </a>
          ) : (
            <span className="font-mono text-xs text-gray-500">
              {session.visitorId.slice(0, 12)}...
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
          {session.pageCount}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
          {formatDuration(duration)}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
          <DeviceIcon className="inline h-4 w-4 text-gray-400" />
          <span className="ml-1 capitalize">
            {session.deviceType ?? "desktop"}
          </span>
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
          <Globe className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
          {getSourceLabel(session)}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
          {session.country ?? "-"}
          {session.city ? `, ${session.city}` : ""}
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-sm">
          <RelativeTime date={session.startedAt} />
        </td>
      </tr>

      {isExpanded && session.pageViews.length > 0 && (
        <tr>
          <td colSpan={8} className="bg-gray-50 px-8 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Paginas vistas
            </p>
            <div className="space-y-1">
              {session.pageViews.map((pv) => (
                <div
                  key={pv.id}
                  className="flex items-center gap-4 rounded px-3 py-1.5 text-sm text-gray-700 odd:bg-white"
                >
                  <span className="min-w-[200px] font-mono text-xs text-gray-500">
                    {pv.path}
                  </span>
                  <span className="min-w-[140px] truncate text-gray-600">
                    {pv.title ?? "-"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDuration(pv.duration)}
                  </span>
                  {pv.scrollDepth !== null && (
                    <Badge
                      label={`${pv.scrollDepth}% scroll`}
                      color="blue"
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
