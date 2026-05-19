"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { GeneratedPackage, SkillConfig } from "@/types/skill";
import {
  simulate,
  estimateSkillMdTokens,
  type Simulation,
  type SimStep,
} from "@/lib/skill-builder/simulator";
import { useLocale, tr } from "@/lib/i18n/locale";
import { UI } from "@/lib/i18n/strings";

export function SimulatorPanel({
  config,
  pkg,
}: {
  config: SkillConfig;
  pkg: GeneratedPackage | null;
}) {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [sim, setSim] = useState<Simulation | null>(null);

  const skillMdTokens = useMemo(() => {
    const skillMd = pkg?.files.find((f) => f.path.endsWith("SKILL.md"))?.content;
    return skillMd ? estimateSkillMdTokens(skillMd) : 0;
  }, [pkg]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setSim(simulate(trimmed, config, locale));
  }

  if (!pkg) {
    return (
      <div className="px-6 py-10 max-w-2xl mx-auto text-center">
        <div
          className="text-ink font-semibold"
          style={{ fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.2px" }}
        >
          {tr(UI.simTitle, locale)}
        </div>
        <p
          className="text-ink-muted-80 mt-3"
          style={{ fontSize: 15, lineHeight: 1.5 }}
        >
          {tr(UI.simRequiresPackage, locale)}
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-5">
        <h3
          className="text-ink font-semibold"
          style={{ fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.2px" }}
        >
          {tr(UI.simTitle, locale)}
        </h3>
        <p
          className="text-ink-muted-80 mt-2"
          style={{ fontSize: 14, lineHeight: 1.55 }}
        >
          {tr(UI.simSubtitle, locale)}
        </p>
        <div className="mt-3 text-[12px] text-ink-muted-48">
          {tr(UI.simTokenCost, locale)}:{" "}
          <span className="text-ink-muted-80 font-mono">
            ≈ {skillMdTokens.toLocaleString()} tokens
          </span>
        </div>
      </header>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-stretch gap-2 rounded-lg border-[1.5px] border-ink bg-canvas p-[6px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr(UI.simPlaceholder, locale)}
            className="flex-1 min-w-0 bg-transparent px-3 py-2 text-[15px] text-ink placeholder:text-ink-muted-48 focus:outline-none"
          />
          <button
            type="submit"
            disabled={query.trim().length < 2}
            className="inline-flex items-center justify-center rounded-md bg-primary text-body-on-dark px-4 py-2 text-[14px] font-semibold hover:opacity-95 disabled:opacity-40 transition whitespace-nowrap"
          >
            {tr(UI.simRun, locale)} <span className="ml-1">▶</span>
          </button>
        </div>
      </form>

      {/* Result */}
      {sim && <SimulationResult sim={sim} />}
    </div>
  );
}

function SimulationResult({ sim }: { sim: Simulation }) {
  const { locale } = useLocale();
  return (
    <div className="space-y-6">
      {/* Triage decision */}
      <section className="rounded-lg border border-hairline bg-canvas-parchment p-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-1.5">
          {tr(UI.simTriage, locale)}
        </div>
        <p className="text-[14px] text-ink leading-relaxed">
          {sim.triageReason}
        </p>
        {sim.steps.length === 0 && (
          <p className="text-[13px] text-primary mt-2">
            {tr(UI.simNoMatch, locale)}
          </p>
        )}
      </section>

      {/* Pipeline steps */}
      {sim.steps.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-3">
            {tr(UI.simPipeline, locale)} ·{" "}
            <span className="text-ink-muted-80">{sim.steps.length}</span>
          </div>
          <ol className="space-y-3">
            {sim.steps.map((step, idx) => (
              <li key={step.workflowId}>
                <StepCard step={step} index={idx + 1} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Skipped */}
      {sim.skipped.length > 0 && (
        <section className="rounded-lg border border-hairline bg-canvas p-4">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-2">
            {tr(UI.simSkipped, locale)}
          </div>
          <ul className="text-[13px] text-ink-muted-80 space-y-1">
            {sim.skipped.map((s) => (
              <li key={s.id}>
                <span className="text-ink-muted-48 mr-2">·</span>
                {s.title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StepCard({ step, index }: { step: SimStep; index: number }) {
  const { locale } = useLocale();
  const triggeredGates = step.stopGates.filter((g) => g.willTrigger);

  return (
    <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3 bg-canvas-parchment border-b border-hairline">
        <div className="w-6 h-6 rounded-full bg-ink text-body-on-dark flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-ink truncate">
            {step.title}
          </div>
        </div>
        {triggeredGates.length > 0 && (
          <span className="text-[11px] text-primary font-medium">
            ⚠ {triggeredGates.length}
          </span>
        )}
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Output shape */}
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-1.5">
            {tr(UI.simStepOutput, locale)}
          </div>
          <pre className="bg-[#1b1b1b] text-[#e2e8f0] rounded-md p-3 overflow-x-auto text-[12px] leading-relaxed font-mono">
            {step.outputShape}
          </pre>
        </div>

        {/* References */}
        {step.referencesLoaded.length > 0 && (
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-1.5">
              {tr(UI.simStepReferences, locale)} · {step.referencesLoaded.length}
            </div>
            <ul className="text-[12.5px] text-ink-muted-80 space-y-0.5">
              {step.referencesLoaded.map((r) => (
                <li key={r} className="font-mono">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* STOP gates */}
        {step.stopGates.length > 0 && (
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted-48 mb-1.5">
              {tr(UI.simStepStop, locale)}
            </div>
            <ul className="space-y-1.5">
              {step.stopGates.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className={`mt-1 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${g.willTrigger ? "bg-primary" : "bg-ink"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink leading-snug">
                      {g.rule}
                    </div>
                    {g.willTrigger && (
                      <div className="text-[11px] text-primary mt-0.5">
                        {tr(UI.simStopWillTrigger, locale)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {step.stopGates.every((g) => !g.willTrigger) && (
                <li className="text-[12px] text-ink-muted-48 italic">
                  {tr(UI.simAllPass, locale)}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
