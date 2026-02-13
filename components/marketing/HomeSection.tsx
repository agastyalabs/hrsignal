import * as React from "react";

import { Container } from "@/components/layout/Container";
import { MotionSection } from "@/components/marketing/MotionSection";

export function HomeSection({
  children,
  className = "",
  containerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    // Global vertical rhythm: 48px mobile / 64px tablet / 96px desktop.
    <section className={`py-12 sm:py-16 lg:py-24 ${className}`}>
      <Container className={containerClassName}>
        <MotionSection>{children}</MotionSection>
      </Container>
    </section>
  );
}
