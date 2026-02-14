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
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true, margin: "-10% 0px -10% 0px" }}
      transition={reduce ? undefined : { duration: 0.32, ease: "easeOut" }}
      className={`u-card-hover rounded-[var(--radius-lg)] border border-[rgba(148,163,184,0.18)] bg-[rgba(15,23,42,0.70)] p-5 shadow-[0_14px_50px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(16,185,129,0.35)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_18px_70px_rgba(0,0,0,0.55)] motion-reduce:transition-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
