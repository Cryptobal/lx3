import {
  MessageSquare,
  Mail,
  MousePointerClick,
  Phone,
  Calendar,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  UserPlus,
  FileInput,
  Globe,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";
import type { ActivityType } from "@/lib/generated/prisma/client";

const ACTIVITY_ICONS: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  NOTE: { icon: MessageSquare, color: "text-zinc-600", bg: "bg-zinc-100" },
  EMAIL_SENT: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  EMAIL_OPENED: { icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
  EMAIL_CLICKED: { icon: MousePointerClick, color: "text-blue-600", bg: "bg-blue-50" },
  CALL: { icon: Phone, color: "text-green-600", bg: "bg-green-50" },
  MEETING: { icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  QUOTE_SENT: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  QUOTE_VIEWED: { icon: Eye, color: "text-amber-600", bg: "bg-amber-50" },
  QUOTE_ACCEPTED: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  QUOTE_REJECTED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  DEAL_STAGE_CHANGED: { icon: ArrowRightLeft, color: "text-indigo-600", bg: "bg-indigo-50" },
  CONTACT_CREATED: { icon: UserPlus, color: "text-sky-600", bg: "bg-sky-50" },
  FORM_SUBMISSION: { icon: FileInput, color: "text-teal-600", bg: "bg-teal-50" },
  WEBSITE_VISIT: { icon: Globe, color: "text-orange-600", bg: "bg-orange-50" },
  CHATBOT_CONVERSATION: { icon: Bot, color: "text-violet-600", bg: "bg-violet-50" },
};

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string | null;
  createdAt: Date | string;
  contact?: { firstName: string; lastName?: string | null } | null;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Actividad Reciente
        </h3>
      </div>
      {activities.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No hay actividades recientes
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {activities.map((activity) => {
            const config = ACTIVITY_ICONS[activity.type] ?? ACTIVITY_ICONS.NOTE;
            const Icon = config.icon;
            return (
              <li key={activity.id} className="px-6 py-3 flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-0.5",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {activity.title}
                  </p>
                  {activity.contact && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {activity.contact.firstName} {activity.contact.lastName ?? ""}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-xs">
                  <RelativeTime date={activity.createdAt} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
