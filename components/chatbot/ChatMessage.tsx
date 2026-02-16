import { cn } from "@/lib/utils/cn";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  if (!content) return null;

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-accent/10 dark:bg-accent/20"
            : "bg-accent"
        )}
      >
        {isAssistant ? (
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        ) : (
          <User className="h-3.5 w-3.5 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAssistant
            ? "rounded-tl-md bg-surface text-foreground dark:bg-surface-elevated dark:text-white"
            : "rounded-tr-md bg-accent text-white"
        )}
      >
        {content.split("\n").map((line, i) => (
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    </div>
  );
}
