"use client";

import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/routing";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-[11px] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]",
        secondary:
          "rounded-[11px] border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:border-[var(--coral)] hover:text-[var(--coral)]",
        ghost:
          "text-[var(--text-secondary)] hover:text-[var(--accent)]",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface CTAButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
}

export function CTAButton({
  children,
  variant,
  size,
  href,
  onClick,
  className,
  external,
}: CTAButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

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
