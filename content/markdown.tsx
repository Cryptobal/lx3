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
  | { type: "blockquote"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "code"; text: string };

// --- Parsing ---

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
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

    // Horizontal rule
    if (/^\s*---\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
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

    // Table
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const headers = splitTableRow(line);
      i += 2; // Skip header and separator
      const rows: string[][] = [];

      while (i < lines.length && lines[i].trim() !== "" && lines[i].includes("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }

      blocks.push({ type: "table", headers, rows });
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

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*---\s*$/.test(lines[i]) &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) &&
      !lines[i].trim().startsWith("- ") &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
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
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      const href = match[3];
      const isExternal = /^https?:\/\//.test(href);
      const isWhatsApp = href.startsWith("https://wa.me/");
      const rel = isExternal
        ? isWhatsApp
          ? "nofollow noopener noreferrer"
          : "noopener noreferrer"
        : undefined;
      nodes.push(
        <a
          key={key++}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={rel}
          className="text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-white"
        >
          {renderInline(match[2])}
        </a>
      );
    } else if (match[4]) {
      // **bold**
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {renderInline(match[4])}
        </strong>
      );
    } else if (match[5]) {
      // *italic*
      nodes.push(
        <em key={key++} className="italic text-white/70">
          {renderInline(match[5])}
        </em>
      );
    } else if (match[6]) {
      // `code`
      nodes.push(
        <code
          key={key++}
          className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-accent"
        >
          {match[6]}
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
    case "blockquote":
      return (
        <blockquote className="mb-6 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-5 text-base leading-relaxed text-white/85">
          {renderInline(block.text)}
        </blockquote>
      );

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

    case "ol":
      return (
        <ol className="mb-5 space-y-3 pl-6 text-base leading-relaxed text-white/75">
          {block.items.map((item, i) => (
            <li key={i} className="list-decimal pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className="mb-6 overflow-x-auto rounded-2xl border border-[var(--border-subtle)]">
          <table className="min-w-full border-collapse bg-[var(--bg-elevated)] text-left">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-white/5">
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-sm font-semibold text-white"
                  >
                    {renderInline(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[var(--border-subtle)] last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-sm leading-relaxed text-white/75"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "hr":
      return <hr className="my-10 border-[var(--border-subtle)]" />;

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

function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .trim();
}

const FAQ_SECTION_HEADERS = [
  "## Preguntas frecuentes",
  "## FAQ",
  "## Frequently Asked Questions",
];

function isFaqSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  return FAQ_SECTION_HEADERS.some((h) => trimmed === h);
}

export function extractFaqs(content: string) {
  const lines = content.split("\n");
  const faqs: { question: string; answer: string }[] = [];
  const faqSectionIndex = lines.findIndex(isFaqSectionHeader);

  if (faqSectionIndex === -1) {
    return faqs;
  }

  let i = faqSectionIndex + 1;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith("## ") && !isFaqSectionHeader(line)) {
      break;
    }

    if (line.startsWith("### ")) {
      const question = stripMarkdown(line.slice(4));
      i++;
      const answerLines: string[] = [];

      while (i < lines.length) {
        const current = lines[i].trim();
        if (!current) {
          i++;
          if (answerLines.length > 0) break;
          continue;
        }
        if (current.startsWith("### ") || current.startsWith("## ")) {
          break;
        }
        answerLines.push(stripMarkdown(current));
        i++;
      }

      if (question && answerLines.length > 0) {
        faqs.push({
          question,
          answer: answerLines.join(" "),
        });
      }

      continue;
    }

    i++;
  }

  return faqs;
}
