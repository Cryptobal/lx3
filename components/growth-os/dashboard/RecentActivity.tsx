import {
  Mail,
  Phone,
  FileText,
  MessageSquare,
  UserPlus,
  Globe,
  ArrowRightLeft,
  Eye,
  CheckCircle2,
  XCircle,
  MousePointerClick,
  StickyNote,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { RelativeTime } from "@/components/growth-os/shared/RelativeTime";

const typeIcons: Record<string, { icon: LucideIcon; color: string }> = {
  NOTE: { icon: StickyNote, color: "text-zinc-400 bg-zinc-800" },
  EMAIL_SENT: { icon: Mail, color: "text-blue-400 bg-blue-500/10" },
  EMAIL_OPENED: { icon: Eye, color: "text-purple-400 bg-purple-500/10" },
  EMAIL_CLICKED: { icon: MousePointerClick, color: "text-green-400 bg-green-500/10" },
  CALL: { icon: Phone, color: "text-teal-400 bg-teal-500/10" },
  MEETING: { icon: CalendarDays, color: "text-indigo-400 bg-indigo-500/10" },
  QUOTE_SENT: { icon: FileText, color: "text-blue-400 bg-blue-500/10" },
  QUOTE_VIEWED: { icon: Eye, color: "text-purple-400 bg-purple-500/10" },
  QUOTE_ACCEPTED: { icon: CheckCircle2, color: "text-green-400 bg-green-500/10" },
  QUOTE_REJECTED: { icon: XCircle, color: "text-red-400 bg-red-500/10" },
  DEAL_STAGE_CHANGED: { icon: ArrowRightLeft, color: "text-orange-400 bg-orange-500/10" },
  CONTACT_CREATED: { icon: UserPlus, color: "text-blue-400 bg-blue-500/10" },
  FORM_SUBMISSION: { icon: FileText, color: "text-green-400 bg-green-500/10" },
  WEBSITE_VISIT: { icon: Globe, color: "text-zinc-400 bg-zinc-800" },
  CHATBOT_CONVERSATION: { icon: MessageSquare, color: "text-violet-400 bg-violet-500/10" },
};

interface Activity {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  contact?: { firstName: string; lastName?: string | null } | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Actividad Reciente</h3>
        <div className="flex h-32 items-center justify-center text-sm text-zinc-500">
          Sin actividad reciente
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-base font-semibold text-zinc-100 mb-4">Actividad Reciente</h3>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {activities.map((activity) => {
          const config = typeIcons[activity.type] ?? typeIcons.NOTE;
          const Icon = config.icon;
          return (
            <li key={activity.id} className="flex items-start gap-3 py-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-700 dark:text-zinc-200">{activity.title}</p>
                <p className="text-xs text-zinc-500">
                  <RelativeTime date={activity.createdAt} />
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
