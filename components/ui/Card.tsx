import * as React from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] shadow-[var(--shadow-soft)] " +
        className
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={"px-6 pt-6 " + className}>{children}</div>;
}

export function CardBody({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={"px-6 pb-6 " + className}>{children}</div>;
}
