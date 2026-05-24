"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownPreview({
  content,
  compact = false,
  language = "markdown",
}: {
  content: string;
  compact?: boolean;
  language?: "markdown" | "json" | "text";
}) {
  if (language === "json") {
    return (
      <pre
        className={`font-mono text-[12.5px] leading-snug whitespace-pre overflow-auto ${
          compact ? "px-3 py-2" : "px-6 py-5"
        }`}
      >
        {content}
      </pre>
    );
  }
  return (
    <div className={`markdown-body ${compact ? "px-3 py-2" : "px-6 py-5"}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
