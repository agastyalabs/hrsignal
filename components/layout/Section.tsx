import * as React from "react";
import { Container } from "@/components/layout/Container";

export function Section({
  children,
  className = "",
  containerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section className={`py-6 sm:py-8 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
