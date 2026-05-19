"use client";

import type { PresetDescriptor } from "@/lib/skill-builder/default-preset";

export function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: PresetDescriptor;
  selected: boolean;
  onSelect: () => void;
}) {
  const isComingSoon = preset.status === "coming-soon";
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isComingSoon}
      className={`w-full text-left rounded-lg border bg-canvas px-4 py-3 transition ${
        selected
          ? "border-primary shadow-sm"
          : "border-hairline hover:border-ink-muted-48"
      } ${isComingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-body-strong text-ink">{preset.name}</div>
        {isComingSoon && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-ink-muted-48">
            Soon
          </span>
        )}
      </div>
      <div className="mt-1 text-caption text-ink-muted-48">{preset.bestFor}</div>
    </button>
  );
}
