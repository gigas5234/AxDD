"use client";

import type { QualityReport } from "@/types/skill";

function scoreColor(score: number): string {
  if (score >= 85) return "text-ink";
  if (score >= 60) return "text-ink-muted-48";
  return "text-primary";
}

export function QualityFooter({
  report,
  onDownload,
  isDownloading,
  hasPackage,
  onInspectQuality,
  inspecting,
}: {
  report: QualityReport | null;
  onDownload: () => void;
  isDownloading: boolean;
  hasPackage: boolean;
  onInspectQuality: () => void;
  inspecting: boolean;
}) {
  const warnCount = report?.warnings.length ?? 0;
  const score = report?.totalScore;
  return (
    <div className="border-t border-hairline bg-canvas-parchment px-3 py-3 flex-shrink-0">
      <button
        type="button"
        onClick={onInspectQuality}
        title="Open quality details"
        className={`w-full flex items-center gap-3 rounded-md px-2 py-2 transition mb-2.5 ${
          inspecting ? "bg-divider-soft" : "hover:bg-divider-soft"
        }`}
      >
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-80 font-medium">
          Quality
        </div>
        <div
          className={`font-semibold ${scoreColor(score ?? 0)}`}
          style={{ fontSize: 30, lineHeight: 1, letterSpacing: "-0.2px" }}
        >
          {score ?? "—"}
        </div>
        {warnCount > 0 && (
          <span className="text-[12px] text-primary font-medium">
            {warnCount} warning{warnCount > 1 ? "s" : ""}
          </span>
        )}
        <span className="ml-auto text-ink-muted-48 text-[12.5px]">
          {inspecting ? "shown" : "details ▸"}
        </span>
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={!hasPackage || isDownloading}
        className="w-full inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[22px] py-[10px] text-[15px] font-normal hover:opacity-95 disabled:opacity-50 transition"
      >
        {isDownloading ? "Preparing ZIP…" : "Download ZIP"}
      </button>
    </div>
  );
}
