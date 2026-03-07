import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseBlocks(content.trim());

  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <React.Fragment key={i}>{renderBlock(block)}</React.Fragment>
      ))}
    </div>
  );
}

// --- Types ---

type Block =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; text: string };

// --- Parsing ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++; // skip opening ```
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push({ type: "h2", text, id: slugify(text) });
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      blocks.push({ type: "h3", text, id: slugify(text) });
      i++;
      continue;
    }

    // Unordered list
    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("```")
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
  }

  return blocks;
}

// --- Inline rendering ---

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match **bold**, *italic*, `code`
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      nodes.push(
        <em key={key++} className="italic text-white/70">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      // `code`
      nodes.push(
        <code
          key={key++}
          className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-accent"
        >
          {match[4]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

// --- Block rendering ---

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="mb-4 mt-12 font-display text-2xl font-bold tracking-tight text-white first:mt-0"
        >
          {renderInline(block.text)}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={block.id}
          className="mb-3 mt-8 font-display text-xl font-semibold text-white"
        >
          {renderInline(block.text)}
        </h3>
      );

    case "paragraph":
      return (
        <p className="mb-5 text-base leading-relaxed text-white/75">
          {renderInline(block.text)}
        </p>
      );

    case "ul":
      return (
        <ul className="mb-5 space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base leading-relaxed text-white/75"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "code":
      return (
        <pre className="mb-5 overflow-x-auto rounded-xl border border-white/5 bg-surface-elevated p-5">
          <code className="font-mono text-sm leading-relaxed text-white/80">
            {block.text}
          </code>
        </pre>
      );
  }
}

// --- Utility: extract headings for ToC ---

export function extractHeadings(
  content: string
): { text: string; id: string; level: 2 | 3 }[] {
  const lines = content.split("\n");
  const headings: { text: string; id: string; level: 2 | 3 }[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      headings.push({ text, id: slugify(text), level: 3 });
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      headings.push({ text, id: slugify(text), level: 2 });
    }
  }

  return headings;
}
