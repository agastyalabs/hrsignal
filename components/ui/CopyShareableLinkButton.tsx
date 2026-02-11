"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";

export function CopyShareableLinkButton({
  label = "Copy shareable link",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      className={className}
      onClick={async () => {
        const url = window.location.href;
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          // Fallback for older browsers.
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }

        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
