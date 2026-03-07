"use client";

import { motion } from "framer-motion";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimateOnScrollProps) {
  const initialOffset =
    direction === "up"
      ? { opacity: 0, y: 30 }
      : direction === "left"
        ? { opacity: 0, x: -30 }
        : { opacity: 0, x: 30 };

  const animateTo =
    direction === "up"
      ? { opacity: 1, y: 0 }
      : { opacity: 1, x: 0 };

  return (
    <motion.div
      initial={initialOffset}
      whileInView={animateTo}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
