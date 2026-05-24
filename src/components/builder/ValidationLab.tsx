"use client";

import { useEffect, useMemo, useState } from "react";
import type { SkillConfig } from "@/types/skill";
import {
  SCENARIO_MANIFEST,
  SCORE_RUBRIC,
  type ScenarioManifestEntry,
  type ScoreKey,
} from "@/lib/skill-builder/templates/tests-templates";
import {
  parseHooks,
  routeRequest,
  type HooksFile,
  type RouteResult,
} from "@/lib/axdd-runtime/router";
import {
  judgeOutput,
  type JudgeResult,
} from "@/lib/axdd-runtime/judge";

type Scores = Record<ScoreKey, number>;

function emptyScores(): Scores {
  return SCORE_RUBRIC.reduce<Scores>(
    (acc, r) => {
      acc[r.key] = 0;
      return acc;
    },
    {} as Scores,
  );
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function buildLogMarkdown(opts: {
  config: SkillConfig;
  scenario: ScenarioManifestEntry;
  scores: Scores;
  total: number;
  verdict: "PASS" | "NEEDS FIX";
  notes: string;
  actualOutput: string;
}): string {
  const today = new Date().toISOString().slice(0, 10);
  const { config, scenario, scores, total, verdict, notes, actualOutput } = opts;
  const lines: string[] = [];
  lines.push("# Validation Log — " + scenario.id + " " + scenario.title);
  lines.push("");
  lines.push("- Kit name: `" + config.skillName + "`");
  lines.push("- Package: `" + config.packageName + "`");
  lines.push("- Primary kit structure: `" + config.packageType + "`");
  lines.push(
    "- Included skill types: " +
      config.includedSkillTypes.map((t) => "`" + t + "`").join(", "),
  );
  lines.push("- Run date: " + today);
  lines.push("- Verdict: **" + verdict + "** (" + total + " / 100)");
  lines.push("");
  lines.push("## Scenario");
  lines.push("- ID: " + scenario.id);
  lines.push("- Title: " + scenario.title);
  lines.push("- Expected route: `" + scenario.expectedRoute + "`");
  lines.push("- Input prompt:");
  lines.push("  > " + scenario.inputPrompt);
  lines.push("");
  lines.push("## Rubric");
  lines.push("| Criterion | Score | Max |");
  lines.push("|---|---:|---:|");
  for (const r of SCORE_RUBRIC) {
    lines.push("| " + r.label + " | " + scores[r.key] + " | " + r.max + " |");
  }
  lines.push("| **Total** | **" + total + "** | **100** |");
  lines.push("");
  lines.push("## Notes");
  lines.push(notes.trim() || "_(none)_");
  lines.push("");
  lines.push("## Actual output (verbatim)");
  lines.push("");
  lines.push("```");
  lines.push(actualOutput.trim() || "(paste from the agent here)");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

export function ValidationLab({
  config,
  hooksJsonContent,
}: {
  config: SkillConfig;
  /** Raw HOOKS.json content from the current generated package, if any. */
  hooksJsonContent?: string;
}) {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIO_MANIFEST[0].id);
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [actualOutput, setActualOutput] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const scenario = useMemo(
    () =>
      SCENARIO_MANIFEST.find((s) => s.id === scenarioId) ??
      SCENARIO_MANIFEST[0],
    [scenarioId],
  );

  // Router result — auto-runs whenever scenario or hooks change.
  const hooks: HooksFile | null = useMemo(() => {
    if (!hooksJsonContent) return null;
    try {
      return parseHooks(hooksJsonContent);
    } catch {
      return null;
    }
  }, [hooksJsonContent]);
  const routeResult: RouteResult | null = useMemo(() => {
    if (!hooks) return null;
    // Strip the wrapping quotes from the scenario manifest's stored prompt.
    const input = scenario.inputPrompt.replace(/^["']|["']$/g, "");
    return routeRequest(input, hooks);
  }, [hooks, scenario]);

  // Judge result — auto-scores against current actualOutput.
  const judgeResult: JudgeResult = useMemo(
    () => judgeOutput(scenario, actualOutput, { routing: routeResult }),
    [scenario, actualOutput, routeResult],
  );

  // Whenever the judge runs, sync manual scores. The user can still
  // tweak by hand afterwards — judge is a suggestion, not a hard set.
  const [autoSyncJudge, setAutoSyncJudge] = useState<boolean>(true);
  useEffect(() => {
    if (!autoSyncJudge) return;
    setScores({ ...judgeResult.scores });
  }, [judgeResult, autoSyncJudge]);

  const total = SCORE_RUBRIC.reduce((acc, r) => acc + scores[r.key], 0);
  const verdict: "PASS" | "NEEDS FIX" = total >= 80 ? "PASS" : "NEEDS FIX";

  function setScore(key: ScoreKey, raw: number) {
    const max = SCORE_RUBRIC.find((r) => r.key === key)?.max ?? 0;
    setScores((s) => ({ ...s, [key]: clamp(raw, 0, max) }));
  }

  function reset() {
    setScores(emptyScores());
    setActualOutput("");
    setNotes("");
  }

  function downloadLog() {
    const md = buildLogMarkdown({
      config,
      scenario,
      scores,
      total,
      verdict,
      notes,
      actualOutput,
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-log-" + scenario.id + ".md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyLog() {
    const md = buildLogMarkdown({
      config,
      scenario,
      scores,
      total,
      verdict,
      notes,
      actualOutput,
    });
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — fallback to download
    }
  }

  return (
    <div className="space-y-4 text-[13px]">
      {/* Scenario selector */}
      <section className="space-y-1.5">
        <label className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
          Scenario
        </label>
        <select
          className="w-full rounded-md border border-hairline px-2.5 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:border-primary-focus focus:ring-1 focus:ring-primary-focus"
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
        >
          {SCENARIO_MANIFEST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.title}
            </option>
          ))}
        </select>
        <div className="text-[12px] text-ink-muted-80 italic leading-snug">
          {scenario.inputPrompt}
        </div>
      </section>

      {/* Expected */}
      <section className="rounded-md border border-hairline bg-canvas overflow-hidden">
        <header className="px-3 py-2 border-b border-divider-soft text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
          Expected
        </header>
        <dl className="px-3 py-2 space-y-2 text-[12.5px]">
          <div>
            <dt className="text-ink-muted-80">Route</dt>
            <dd className="font-mono text-ink mt-0.5">
              {scenario.expectedRoute}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted-80">Required outputs</dt>
            <dd>
              <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-ink">
                {scenario.requiredOutputs.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted-80">Forbidden</dt>
            <dd>
              <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-ink">
                {scenario.forbidden.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted-80">Pass criteria</dt>
            <dd>
              <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-ink">
                {scenario.passCriteria.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      {/* Router auto-match */}
      <section className="rounded-md border border-hairline bg-canvas overflow-hidden">
        <header className="px-3 py-2 border-b border-divider-soft text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium flex items-center gap-2">
          <span className="flex-1">Router (rule-based)</span>
          {routeResult && (
            <span
              className={`text-[10.5px] font-mono px-1.5 py-[1px] rounded-sm border ${
                routeResult.confidence === "high"
                  ? "border-primary/40 text-primary bg-primary/5"
                  : routeResult.confidence === "none"
                    ? "border-hairline text-ink-muted-48"
                    : "border-ink/20 text-ink"
              }`}
            >
              {routeResult.confidence}
            </span>
          )}
        </header>
        <div className="px-3 py-2 text-[12.5px] space-y-1">
          {!hooks && (
            <div className="text-ink-muted-48 italic">
              No HOOKS.json available (this kit ships without routing). The
              judge's routing slice will fall back to 0.
            </div>
          )}
          {hooks && routeResult && (
            <>
              <div>
                <span className="text-ink-muted-80">Matched hook: </span>
                <span className="font-mono text-ink">
                  {routeResult.matchedHookId ?? "—"}
                </span>
              </div>
              {routeResult.route?.stage && (
                <div>
                  <span className="text-ink-muted-80">Stage: </span>
                  <span className="font-mono text-ink">
                    {routeResult.route.stage}
                  </span>
                </div>
              )}
              {routeResult.route?.template && (
                <div>
                  <span className="text-ink-muted-80">Template: </span>
                  <span className="font-mono text-ink">
                    {routeResult.route.template}
                  </span>
                </div>
              )}
              {routeResult.matchedKeywords.length > 0 && (
                <div>
                  <span className="text-ink-muted-80">Keywords: </span>
                  <span className="font-mono text-ink">
                    {routeResult.matchedKeywords.join(", ")}
                  </span>
                </div>
              )}
              {routeResult.missingContext.length > 0 && (
                <div className="text-primary">
                  Missing context: {routeResult.missingContext.join(", ")}
                </div>
              )}
              <div className="text-[11.5px] text-ink-muted-48 italic">
                {routeResult.reason}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Actual output paste */}
      <section className="space-y-1.5">
        <label className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
          Actual output
        </label>
        <textarea
          rows={8}
          value={actualOutput}
          onChange={(e) => setActualOutput(e.target.value)}
          placeholder="Paste the agent's response here."
          className="w-full rounded-md border border-hairline px-2.5 py-2 text-[12.5px] font-mono leading-snug bg-canvas text-ink focus:outline-none focus:border-primary-focus focus:ring-1 focus:ring-primary-focus"
        />
      </section>

      {/* Judge details */}
      <section className="rounded-md border border-hairline bg-canvas overflow-hidden">
        <header className="px-3 py-2 border-b border-divider-soft text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium flex items-center gap-2">
          <span className="flex-1">Judge (rule-based)</span>
          <label className="text-[10.5px] text-ink-muted-80 flex items-center gap-1 normal-case tracking-normal cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncJudge}
              onChange={(e) => setAutoSyncJudge(e.target.checked)}
              className="rounded-sm accent-primary"
            />
            auto-sync to rubric
          </label>
        </header>
        <div className="px-3 py-2 text-[12px] space-y-2">
          {!actualOutput.trim() && (
            <div className="text-ink-muted-48 italic">
              Paste an actual output above to score. All criteria fail by
              default with no content.
            </div>
          )}
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium mb-1">
              Required outputs
            </div>
            <ul className="space-y-0.5">
              {judgeResult.requiredOutputs.map((v, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span
                    className={`inline-block mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      v.status === "pass"
                        ? "bg-ink"
                        : v.status === "warn"
                          ? "bg-ink-muted-48"
                          : "bg-primary"
                    }`}
                  />
                  <span className="text-ink leading-snug">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium mb-1">
              Forbidden (pass = NOT violated)
            </div>
            <ul className="space-y-0.5">
              {judgeResult.forbidden.map((v, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span
                    className={`inline-block mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      v.status === "pass" ? "bg-ink" : "bg-primary"
                    }`}
                  />
                  <span
                    className={`leading-snug ${v.status === "fail" ? "text-primary" : "text-ink"}`}
                  >
                    {v.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[11.5px] text-ink-muted-48 italic leading-snug pt-1 border-t border-divider-soft">
            {judgeResult.notes}
          </div>
        </div>
      </section>

      {/* Rubric */}
      <section className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
            Rubric (100){" "}
            {autoSyncJudge && (
              <span className="text-[9.5px] normal-case tracking-normal text-primary ml-1">
                · judge-synced
              </span>
            )}
          </label>
          <div className="text-[13px] font-mono text-ink">
            {total} / 100 ·{" "}
            <span
              className={
                verdict === "PASS"
                  ? "text-ink font-semibold"
                  : "text-primary font-semibold"
              }
            >
              {verdict}
            </span>
          </div>
        </div>
        <ul className="rounded-md border border-hairline bg-canvas divide-y divide-divider-soft overflow-hidden">
          {SCORE_RUBRIC.map((r) => (
            <li
              key={r.key}
              className="px-3 py-2 flex items-center gap-3 text-[12.5px]"
            >
              <span className="flex-1 text-ink">{r.label}</span>
              <input
                type="number"
                min={0}
                max={r.max}
                value={scores[r.key]}
                onChange={(e) =>
                  setScore(r.key, Number.parseInt(e.target.value, 10))
                }
                className="w-14 text-right rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[12.5px] bg-canvas text-ink focus:outline-none focus:border-primary-focus"
              />
              <span className="text-ink-muted-80 font-mono w-7 text-right">
                /{r.max}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[11.5px] text-ink-muted-48 leading-snug">
          PASS at ≥ 80 / 100. Rule-based judge auto-suggests scores; uncheck
          auto-sync to override manually. AI judge provider is wired but
          disabled until Phase 2.
        </p>
      </section>

      {/* Notes */}
      <section className="space-y-1.5">
        <label className="text-[10.5px] uppercase tracking-[0.16em] text-ink-muted-48 font-medium">
          Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Free-form notes that should travel with the log."
          className="w-full rounded-md border border-hairline px-2.5 py-2 text-[12.5px] leading-snug bg-canvas text-ink focus:outline-none focus:border-primary-focus focus:ring-1 focus:ring-primary-focus"
        />
      </section>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={downloadLog}
          className="inline-flex items-center justify-center rounded-pill bg-primary text-body-on-dark px-[18px] py-[7px] text-[13px] font-medium hover:opacity-90 transition"
        >
          Export validation-log.md
        </button>
        <button
          type="button"
          onClick={copyLog}
          className="inline-flex items-center justify-center rounded-pill border border-ink/30 bg-canvas text-ink px-[14px] py-[7px] text-[12.5px] font-medium hover:bg-divider-soft transition"
        >
          {copied ? "Copied!" : "Copy markdown"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto text-[12px] text-ink-muted-48 hover:text-ink underline-offset-2 hover:underline transition"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
