"use client";

import type { ReactNode } from "react";

interface EmailLinkProps {
  email: string;
  displayText?: string;
  className?: string;
  children?: ReactNode;
}

export function EmailLink({ email, displayText, className, children }: EmailLinkProps) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
    >
      {children ?? (displayText ?? email)}
    </a>
  );
}
