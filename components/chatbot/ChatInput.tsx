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
    <div className="flex items-end gap-2 rounded-xl border border-foreground/10 bg-background p-2 dark:border-white/10 dark:bg-primary/50">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-foreground/30 disabled:opacity-50 dark:text-white dark:placeholder:text-white/30"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || disabled}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
          value.trim() && !disabled
            ? "bg-accent text-white hover:bg-accent/90"
            : "bg-foreground/5 text-foreground/20 dark:bg-white/5 dark:text-white/20"
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
