"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MotionSection({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true, margin: "-8% 0px -8% 0px" }}
      transition={reduce ? undefined : { duration: 0.32, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
