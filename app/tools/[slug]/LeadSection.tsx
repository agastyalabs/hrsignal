"use client";

import { useEffect, useRef } from "react";

export function LeadSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#lead") {
      // Ensure the section is in view when arriving via /tools/:slug#lead
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, []);

  return (
    <div ref={ref} id="lead" className="scroll-mt-24">
      {children}
    </div>
  );
}
