"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MotionSection({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true, margin: "-10% 0px -10% 0px" }}
      transition={reduce ? undefined : { duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
