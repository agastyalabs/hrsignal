import type { ComponentProps } from "react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Heading({
  as: Tag,
  children,
  ...rest
}: { as: "h2" | "h3" } & ComponentProps<"h2">) {
  const text = typeof children === "string" ? children : "";
  const id = text ? slugify(text) : undefined;
  return (
    <Tag id={id} {...rest}>
      {children}
    </Tag>
  );
}

export const complianceMdxComponents = {
  h2: (props: ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      {...props}
      className={`font-semibold text-[var(--link)] hover:text-[var(--link-hover)] underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${props.className ?? ""}`}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      {...props}
      className={`rounded border border-[rgba(255,255,255,0.10)] bg-[rgba(2,6,23,0.6)] px-1.5 py-0.5 text-[0.92em] ${props.className ?? ""}`}
    />
  ),
  input: (props: ComponentProps<"input">) => {
    if (props.type === "checkbox") {
      return (
        <input
          {...props}
          className={`mr-2 translate-y-[1px] accent-[var(--primary)] ${props.className ?? ""}`}
        />
      );
    }
    return <input {...props} />;
  },
};
