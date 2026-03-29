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
  NOTE: { icon: StickyNote, color: "text-gray-500 bg-gray-100" },
  EMAIL_SENT: { icon: Mail, color: "text-blue-500 bg-blue-100" },
  EMAIL_OPENED: { icon: Eye, color: "text-purple-500 bg-purple-100" },
  EMAIL_CLICKED: { icon: MousePointerClick, color: "text-green-500 bg-green-100" },
  CALL: { icon: Phone, color: "text-teal-500 bg-teal-100" },
  MEETING: { icon: CalendarDays, color: "text-indigo-500 bg-indigo-100" },
  QUOTE_SENT: { icon: FileText, color: "text-blue-500 bg-blue-100" },
  QUOTE_VIEWED: { icon: Eye, color: "text-purple-500 bg-purple-100" },
  QUOTE_ACCEPTED: { icon: CheckCircle2, color: "text-green-500 bg-green-100" },
  QUOTE_REJECTED: { icon: XCircle, color: "text-red-500 bg-red-100" },
  DEAL_STAGE_CHANGED: { icon: ArrowRightLeft, color: "text-orange-500 bg-orange-100" },
  CONTACT_CREATED: { icon: UserPlus, color: "text-blue-500 bg-blue-100" },
  FORM_SUBMISSION: { icon: FileText, color: "text-green-500 bg-green-100" },
  WEBSITE_VISIT: { icon: Globe, color: "text-gray-500 bg-gray-100" },
  CHATBOT_CONVERSATION: { icon: MessageSquare, color: "text-violet-500 bg-violet-100" },
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
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        Sin actividad reciente
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
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
              <p className="truncate text-sm text-gray-800">{activity.title}</p>
              <p className="text-xs">
                <RelativeTime date={activity.createdAt} />
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
