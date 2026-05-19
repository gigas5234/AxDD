"use client";

export function RawEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (next: string) => void;
}) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className="w-full h-full min-h-[60vh] px-6 py-5 font-mono text-[13px] leading-relaxed text-ink bg-canvas outline-none resize-none border-0"
    />
  );
}
