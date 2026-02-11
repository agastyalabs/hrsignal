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
    <section className={`py-10 sm:py-12 lg:py-14 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
