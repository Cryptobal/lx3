"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border bg-surface-elevated p-2 transition-colors focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 dark:border-white/10 dark:bg-surface-elevated dark:focus-within:border-accent/50">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted disabled:opacity-50 dark:text-white dark:placeholder:text-muted-foreground"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
          value.trim() && !disabled
            ? "bg-accent text-white shadow-sm hover:bg-accent-hover active:scale-95"
            : "bg-border/50 text-muted dark:bg-white/5 dark:text-muted-foreground"
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
