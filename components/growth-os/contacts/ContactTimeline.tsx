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
  NOTE: { icon: StickyNote, color: "text-gray-500 bg-gray-100", border: "border-gray-300" },
  EMAIL_SENT: { icon: Mail, color: "text-blue-500 bg-blue-100", border: "border-blue-300" },
  EMAIL_OPENED: { icon: Eye, color: "text-purple-500 bg-purple-100", border: "border-purple-300" },
  EMAIL_CLICKED: { icon: MousePointerClick, color: "text-green-500 bg-green-100", border: "border-green-300" },
  CALL: { icon: Phone, color: "text-teal-500 bg-teal-100", border: "border-teal-300" },
  MEETING: { icon: CalendarDays, color: "text-indigo-500 bg-indigo-100", border: "border-indigo-300" },
  QUOTE_SENT: { icon: FileText, color: "text-blue-500 bg-blue-100", border: "border-blue-300" },
  QUOTE_VIEWED: { icon: Eye, color: "text-purple-500 bg-purple-100", border: "border-purple-300" },
  QUOTE_ACCEPTED: { icon: CheckCircle2, color: "text-green-500 bg-green-100", border: "border-green-300" },
  QUOTE_REJECTED: { icon: XCircle, color: "text-red-500 bg-red-100", border: "border-red-300" },
  DEAL_STAGE_CHANGED: { icon: ArrowRightLeft, color: "text-orange-500 bg-orange-100", border: "border-orange-300" },
  CONTACT_CREATED: { icon: UserPlus, color: "text-blue-500 bg-blue-100", border: "border-blue-300" },
  FORM_SUBMISSION: { icon: FileText, color: "text-green-500 bg-green-100", border: "border-green-300" },
  WEBSITE_VISIT: { icon: Globe, color: "text-gray-500 bg-gray-100", border: "border-gray-300" },
  CHATBOT_CONVERSATION: { icon: MessageSquare, color: "text-violet-500 bg-violet-100", border: "border-violet-300" },
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
      <p className="py-8 text-center text-sm text-gray-400">
        Sin actividad registrada
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-px bg-gray-200" />

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
                <p className="text-sm text-gray-800">{activity.title}</p>
                {activity.description && (
                  <p className="mt-0.5 text-xs text-gray-500">
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
