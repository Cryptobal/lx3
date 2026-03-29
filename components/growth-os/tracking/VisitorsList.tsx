"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  User,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/growth-os/utils/format";

interface PageViewData {
  id: string;
  path: string;
  title: string | null;
  duration: number | null;
  scrollDepth: number | null;
  viewedAt: string;
}

interface SessionData {
  id: string;
  visitorId: string;
  deviceType: string | null;
  referrer: string | null;
  utmSource: string | null;
  country: string | null;
  city: string | null;
  startedAt: string;
  lastActivityAt: string;
  contactId: string | null;
  contactName: string | null;
  pageViews: PageViewData[];
}

interface VisitorsListProps {
  sessions: SessionData[];
}

function getDeviceIcon(deviceType: string | null) {
  switch (deviceType?.toLowerCase()) {
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Monitor;
  }
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function getSessionDuration(session: SessionData): number {
  const start = new Date(session.startedAt).getTime();
  const end = new Date(session.lastActivityAt).getTime();
  return Math.round((end - start) / 1000);
}

function getReferrerDomain(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace("www.", "");
  } catch {
    return referrer;
  }
}

export function VisitorsList({ sessions }: VisitorsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <Globe className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Sin sesiones recientes
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          Las sesiones de visitantes aparecerán aquí cuando se detecten visitas.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {sessions.map((session) => {
        const isExpanded = expandedIds.has(session.id);
        const DeviceIcon = getDeviceIcon(session.deviceType);
        const duration = getSessionDuration(session);
        const source = session.utmSource || getReferrerDomain(session.referrer);

        return (
          <div key={session.id}>
            {/* Session row */}
            <button
              type="button"
              onClick={() => toggleExpanded(session.id)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
            >
              {/* Expand icon */}
              <div className="flex-shrink-0 text-zinc-400">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>

              {/* Avatar */}
              <div
                className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                  session.contactId
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                {session.contactId ? (
                  <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <Globe className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                )}
              </div>

              {/* Name / ID */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {session.contactName || "Visitante anónimo"}
                  </span>
                  {!session.contactName && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                      {session.visitorId.slice(0, 8)}...
                    </span>
                  )}
                </div>
                {session.contactId && (
                  <Link
                    href={`/admin/contacts/${session.contactId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5"
                  >
                    Ver contacto
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Pages count */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 min-w-[80px]">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {session.pageViews.length}
                </span>
                <span>
                  {session.pageViews.length === 1 ? "página" : "páginas"}
                </span>
              </div>

              {/* Duration */}
              <div className="hidden sm:flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 min-w-[70px]">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(duration)}
              </div>

              {/* Device */}
              <div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-500 min-w-[30px] justify-center">
                <DeviceIcon className="w-4 h-4" />
              </div>

              {/* Source */}
              <div className="hidden lg:block text-sm text-zinc-500 dark:text-zinc-400 min-w-[100px] truncate">
                {source || "Directo"}
              </div>

              {/* Country */}
              <div className="hidden lg:block text-sm text-zinc-500 dark:text-zinc-400 min-w-[40px] text-center">
                {session.country || "—"}
              </div>

              {/* Time */}
              <div className="text-xs text-zinc-400 dark:text-zinc-500 min-w-[90px] text-right">
                {formatRelativeTime(session.startedAt)}
              </div>
            </button>

            {/* Expanded: page views */}
            {isExpanded && (
              <div className="bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
                <div className="px-4 py-2 ml-[52px]">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Páginas visitadas
                  </h4>
                  <div className="space-y-1">
                    {session.pageViews.map((pv) => (
                      <div
                        key={pv.id}
                        className="flex items-center gap-3 py-1.5 text-sm"
                      >
                        {/* Path */}
                        <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 min-w-[200px] truncate">
                          {pv.path}
                        </span>

                        {/* Title */}
                        <span className="text-zinc-500 dark:text-zinc-400 flex-1 truncate text-xs">
                          {pv.title || "—"}
                        </span>

                        {/* Duration */}
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 min-w-[50px] text-right">
                          {pv.duration ? formatDuration(pv.duration) : "—"}
                        </span>

                        {/* Scroll depth */}
                        <div className="min-w-[80px] flex items-center gap-1.5">
                          {pv.scrollDepth !== null ? (
                            <>
                              <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(pv.scrollDepth, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                                {pv.scrollDepth}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
