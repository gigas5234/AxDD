"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownPreview({
  content,
  compact = false,
}: {
  content: string;
  compact?: boolean;
}) {
  return (
    <div className={`markdown-body ${compact ? "px-3 py-2" : "px-6 py-5"}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
