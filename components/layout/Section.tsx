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
    <section className={`py-10 sm:py-14 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
