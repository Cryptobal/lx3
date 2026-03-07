"use client";

import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/routing";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:brightness-110",
        secondary:
          "border border-white/10 bg-white/5 text-white hover:bg-white/10",
        ghost: "text-white/70 hover:text-accent",
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
