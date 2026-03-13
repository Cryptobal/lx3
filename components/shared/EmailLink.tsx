"use client";

import type { ReactNode } from "react";

interface EmailLinkProps {
  email: string;
  displayText?: string;
  className?: string;
  children?: ReactNode;
}

export function EmailLink({ email, displayText, className, children }: EmailLinkProps) {
  const [localPart, domain] = email.split("@");
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${localPart}@${domain}`;
      }}
      className={className}
    >
      {children ?? (displayText ?? email)}
    </a>
  );
}
