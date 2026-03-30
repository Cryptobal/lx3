"use client";

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

const typeConfig: Record<string, { icon: LucideIcon; color: string; border: string }> = {
  NOTE: { icon: StickyNote, color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800", border: "border-zinc-300 dark:border-zinc-600" },
  EMAIL_SENT: { icon: Mail, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30", border: "border-blue-300 dark:border-blue-700" },
  EMAIL_OPENED: { icon: Eye, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30", border: "border-purple-300 dark:border-purple-700" },
  EMAIL_CLICKED: { icon: MousePointerClick, color: "text-green-500 bg-green-100 dark:bg-green-900/30", border: "border-green-300 dark:border-green-700" },
  CALL: { icon: Phone, color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30", border: "border-teal-300 dark:border-teal-700" },
  MEETING: { icon: CalendarDays, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30", border: "border-indigo-300 dark:border-indigo-700" },
  QUOTE_SENT: { icon: FileText, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30", border: "border-blue-300 dark:border-blue-700" },
  QUOTE_VIEWED: { icon: Eye, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30", border: "border-purple-300 dark:border-purple-700" },
  QUOTE_ACCEPTED: { icon: CheckCircle2, color: "text-green-500 bg-green-100 dark:bg-green-900/30", border: "border-green-300 dark:border-green-700" },
  QUOTE_REJECTED: { icon: XCircle, color: "text-red-500 bg-red-100 dark:bg-red-900/30", border: "border-red-300 dark:border-red-700" },
  DEAL_STAGE_CHANGED: { icon: ArrowRightLeft, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30", border: "border-orange-300 dark:border-orange-700" },
  CONTACT_CREATED: { icon: UserPlus, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30", border: "border-blue-300 dark:border-blue-700" },
  FORM_SUBMISSION: { icon: FileText, color: "text-green-500 bg-green-100 dark:bg-green-900/30", border: "border-green-300 dark:border-green-700" },
  WEBSITE_VISIT: { icon: Globe, color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800", border: "border-zinc-300 dark:border-zinc-600" },
  CHATBOT_CONVERSATION: { icon: MessageSquare, color: "text-violet-500 bg-violet-100 dark:bg-violet-900/30", border: "border-violet-300 dark:border-violet-700" },
};

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt: string;
}

interface ContactTimelineProps {
  activities: Activity[];
}

export function ContactTimeline({ activities }: ContactTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
        Sin actividad registrada
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-700" />

      <ul className="space-y-4">
        {activities.map((activity) => {
          const config = typeConfig[activity.type] ?? typeConfig.NOTE;
          const Icon = config.icon;
          return (
            <li key={activity.id} className="relative flex gap-4 pl-0">
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${config.color} ${config.border}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 pb-2">
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{activity.title}</p>
                {activity.description && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {activity.description}
                  </p>
                )}
                <p className="mt-1 text-xs">
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
