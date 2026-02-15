import { cn } from "@/lib/utils/cn";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "dark" | "accent";
}

export function SectionWrapper({
  children,
  className,
  id,
  variant = "default",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 py-20 md:py-28 lg:py-32",
        variant === "default" && "bg-background",
        variant === "dark" &&
          "bg-primary text-white dark:bg-white/5",
        variant === "accent" &&
          "bg-accent/5 dark:bg-accent/10",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
