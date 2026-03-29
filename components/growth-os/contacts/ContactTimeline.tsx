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

interface TimelineActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  createdAt: string;
}

interface ContactTimelineProps {
  activities: TimelineActivity[];
}

export function ContactTimeline({ activities }: ContactTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No hay actividades registradas
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />

      <ul className="space-y-0">
        {activities.map((activity, index) => {
          const config = ACTIVITY_ICONS[activity.type] ?? ACTIVITY_ICONS.NOTE;
          const Icon = config.icon;
          const isLast = index === activities.length - 1;

          return (
            <li key={activity.id} className="relative flex gap-3 pb-6 last:pb-0">
              <div
                className={cn(
                  "relative z-10 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full",
                  config.bg
                )}
              >
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap">
                    {activity.description}
                  </p>
                )}
                <div className="mt-1 text-xs">
                  <RelativeTime date={activity.createdAt} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
