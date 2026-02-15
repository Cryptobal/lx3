import { cn } from "@/lib/utils/cn";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-accent/10 dark:bg-accent/20"
            : "bg-foreground/5 dark:bg-white/10"
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-accent" />
        ) : (
          <User className="h-4 w-4 text-foreground/50 dark:text-white/50" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAssistant
            ? "rounded-tl-md bg-foreground/[0.03] text-foreground dark:bg-white/[0.05] dark:text-white"
            : "rounded-tr-md bg-accent text-white"
        )}
      >
        {/* Simple markdown-like rendering */}
        {content.split("\n").map((line, i) => (
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    </div>
  );
}
