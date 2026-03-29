import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const btnClass =
    "mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700";

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action &&
        (action.href ? (
          <Link href={action.href} className={btnClass}>
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className={btnClass}>
            {action.label}
          </button>
        ))}
    </div>
  );
}
