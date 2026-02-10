import * as React from "react";

function isHeading(line: string) {
  return /^#{1,3}\s+/.test(line);
}

function headingLevel(line: string) {
  const m = line.match(/^(#{1,3})\s+/);
  return m ? m[1].length : 0;
}

function stripHeading(line: string) {
  return line.replace(/^#{1,3}\s+/, "");
}

function isUnorderedListItem(line: string) {
  return /^-\s+/.test(line);
}

function stripUnordered(line: string) {
  return line.replace(/^-\s+/, "");
}

function splitParagraphs(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/g);
}

function Inline({ text }: { text: string }) {
  // Minimal inline formatting: **bold** only.
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  for (;;) {
    const m = re.exec(text);
    if (!m) break;
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <strong key={`${m.index}-${m[1]}`} className="font-semibold text-[var(--text)]">
        {m[1]}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function Markdownish({ content }: { content: string }) {
  const blocks = splitParagraphs(content);

  const rendered: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Code block ``` ... ```
    if (block.startsWith("```") && block.endsWith("```")) {
      const code = block.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      rendered.push(
        <pre
          key={`code-${i}`}
          className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-xs leading-relaxed text-[var(--text)]"
        >
          <code>{code}</code>
        </pre>,
      );
      continue;
    }

    const lines = block.split("\n").map((x) => x.trimEnd());

    // Headings
    if (lines.length === 1 && isHeading(lines[0])) {
      const level = headingLevel(lines[0]);
      const text = stripHeading(lines[0]);
      if (level === 1) {
        rendered.push(
          <h1 key={`h1-${i}`} className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            <Inline text={text} />
          </h1>,
        );
      } else if (level === 2) {
        rendered.push(
          <h2 key={`h2-${i}`} className="mt-6 text-xl font-semibold tracking-tight text-[var(--text)]">
            <Inline text={text} />
          </h2>,
        );
      } else {
        rendered.push(
          <h3 key={`h3-${i}`} className="mt-5 text-base font-semibold text-[var(--text)]">
            <Inline text={text} />
          </h3>,
        );
      }
      continue;
    }

    // Unordered list (one or many lines starting with '-')
    if (lines.every((l) => isUnorderedListItem(l))) {
      rendered.push(
        <ul key={`ul-${i}`} className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-muted)]">
          {lines.map((l, idx) => (
            <li key={idx}>
              <Inline text={stripUnordered(l)} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Default paragraph
    rendered.push(
      <p key={`p-${i}`} className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
        <Inline text={lines.join(" ")} />
      </p>,
    );
  }

  return <div className="space-y-2">{rendered}</div>;
}
