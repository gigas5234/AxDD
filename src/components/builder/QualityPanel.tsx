"use client";

import type { QualityReport } from "@/types/skill";

function statusDot(status: "pass" | "warning" | "fail"): string {
  // Single-accent system: pass = ink, warning = muted ink, fail = KT Real Red
  if (status === "pass") return "bg-ink";
  if (status === "warning") return "bg-ink-muted-48";
  return "bg-primary";
}

function scoreColor(score: number): string {
  if (score >= 85) return "text-ink";
  if (score >= 60) return "text-ink-muted-48";
  return "text-primary";
}

export function QualityPanel({ report }: { report: QualityReport | null }) {
  if (!report) {
    return (
      <div className="text-caption text-ink-muted-48 px-4 py-5">
        Generate a package to see its quality report.
      </div>
    );
  }
  return (
    <div className="px-4 py-4 space-y-5">
      <div>
        <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48">
          Quality score
        </div>
        <div
          className={`font-semibold ${scoreColor(report.totalScore)}`}
          style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.28px" }}
        >
          {report.totalScore}
        </div>
      </div>

      <div>
        <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-2">
          Checks
        </div>
        <ul className="space-y-2">
          {report.checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2">
              <span
                className={`mt-[7px] inline-block w-1.5 h-1.5 rounded-full ${statusDot(c.status)}`}
              />
              <div className="min-w-0">
                <div className="text-caption text-ink">{c.label}</div>
                {c.status !== "pass" && (
                  <div className="text-fine-print text-ink-muted-48 leading-snug mt-0.5">
                    {c.message}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {report.warnings.length > 0 && (
        <div>
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-2">
            Warnings
          </div>
          <ul className="space-y-1">
            {report.warnings.map((w, i) => (
              <li key={i} className="text-caption text-ink-muted-80 leading-snug">
                <span className="text-primary mr-1">·</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.suggestions.length > 0 && (
        <div>
          <div className="text-fine-print uppercase tracking-[0.16em] text-ink-muted-48 mb-2">
            Suggestions
          </div>
          <ul className="space-y-1">
            {report.suggestions.map((s, i) => (
              <li key={i} className="text-caption text-ink-muted-48 leading-snug">
                · {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
