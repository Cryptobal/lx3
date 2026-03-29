const presetColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
};

interface BadgeProps {
  label: string;
  color?: "blue" | "green" | "red" | "yellow" | "gray" | (string & {});
  size?: "sm" | "md";
}

export function Badge({ label, color = "gray", size = "sm" }: BadgeProps) {
  const preset = presetColors[color];

  if (preset) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium ${preset.bg} ${preset.text} ${
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
        }`}
      >
        {label}
      </span>
    );
  }

  // Custom hex color
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
