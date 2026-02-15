"use client";

import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/routing";

type Variant = "primary" | "secondary" | "ghost";

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 shadow-sm shadow-accent/20",
  secondary:
    "border border-foreground/10 text-foreground hover:bg-foreground/5 dark:border-white/10 dark:hover:bg-white/5",
  ghost:
    "text-foreground/70 hover:text-foreground underline-offset-4 hover:underline",
};

export function CTAButton({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  external,
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className
  );

  if (href && external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href as "/"} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
