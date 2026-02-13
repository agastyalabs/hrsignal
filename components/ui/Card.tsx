"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true, margin: "-10% 0px -10% 0px" }}
      transition={reduce ? undefined : { duration: 0.28, ease: "easeOut" }}
      className={`u-card-hover rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-[0_1px_1px_rgba(0,0,0,0.22)] motion-reduce:transition-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
