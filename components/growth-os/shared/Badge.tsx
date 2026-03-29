import type { ReactNode } from "react";

const presetColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
};

const variantToColor: Record<string, string> = {
  default: "gray",
  info: "blue",
  success: "green",
  warning: "yellow",
  danger: "red",
  purple: "purple",
};

const extraPresets: Record<string, { bg: string; text: string }> = {
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
};

export interface BadgeProps {
  label?: string;
  children?: ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "gray" | (string & {});
  variant?: "default" | "info" | "success" | "warning" | "danger" | "purple";
  size?: "sm" | "md";
}

export function Badge({ label, children, color, variant, size = "sm" }: BadgeProps) {
  const resolvedColor = color ?? (variant ? variantToColor[variant] ?? "gray" : "gray");
  const text = children ?? label ?? "";

  const preset = presetColors[resolvedColor] ?? extraPresets[resolvedColor];

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  if (preset) {
    return (
      <span className={`inline-flex items-center rounded-full font-medium ${preset.bg} ${preset.text} ${sizeClass}`}>
        {text}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: `${resolvedColor}20`, color: resolvedColor }}
    >
      {text}
    </span>
  );
}
