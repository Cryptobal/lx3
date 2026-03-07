"use client";

import { cn } from "@/lib/utils/cn";
import { Sparkles, User } from "lucide-react";
import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

function processInlineMarkdown(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      result.push(
        <strong key={`b${key++}`} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3] && match[4]) {
      result.push(
        <a
          key={`a${key++}`}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-accent hover:text-accent-hover transition-colors"
        >
          {match[3]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");

  return lines.map((line, i) => {
    const isBullet = /^[-*]\s/.test(line);
    const lineContent = isBullet ? line.replace(/^[-*]\s/, "") : line;
    const parts = processInlineMarkdown(lineContent);

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2 mt-1 first:mt-0">
          <span className="text-accent shrink-0">&#8226;</span>
          <span>{parts}</span>
        </div>
      );
    }

    return (
      <p key={i} className={cn(i > 0 && "mt-2")}>
        {lineContent ? parts : "\u00A0"}
      </p>
    );
  });
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
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant ? "bg-accent/10" : "bg-accent"
        )}
      >
        {isAssistant ? (
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        ) : (
          <User className="h-3.5 w-3.5 text-white" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAssistant
            ? "rounded-tl-md bg-surface-elevated text-white/90"
            : "rounded-tr-md bg-accent text-white"
        )}
      >
        {isAssistant ? renderMarkdown(content) : content}
      </div>
    </div>
  );
}
