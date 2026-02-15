"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

interface ProgressiveDisclosureProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ProgressiveDisclosure({
  trigger,
  children,
  className,
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("border-b border-foreground/5 dark:border-white/5", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground/60 transition-colors hover:text-foreground dark:text-white/60 dark:hover:text-white"
      >
        {trigger}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="text-sm text-foreground/50 dark:text-white/50 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
