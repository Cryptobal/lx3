import { cn } from "@/lib/utils/cn";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-6 py-20 md:py-28", className)}>
      {children}
    </section>
  );
}
