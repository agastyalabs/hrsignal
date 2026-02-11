import * as React from "react";

import { Container } from "@/components/layout/Container";

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
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
