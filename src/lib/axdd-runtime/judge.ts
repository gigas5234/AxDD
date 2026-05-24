/**
 * AXDD Judge — scores an actual agent response against a scenario's
 * expected output.
 *
 * v0.1.1 ships a deterministic rule-based provider. The shape of the
 * result is identical to what an AI provider will eventually return, so
 * the UI can swap providers without changing.
 *
 * Rule-based heuristics:
 *   - Required outputs: tokenize each "required output" line; the
 *     actualOutput passes the line if ≥ 60% of its content tokens appear
 *     in the response (case-insensitive substring on the lowered text).
 *   - Forbidden behavior: each forbidden line is "violated" if any of
 *     its content tokens appears in the response *as a positive
 *     statement*. We use a coarse signal — substring match. Forbidden
 *     hits drag the score down.
 *   - Pass criteria: same tokenized match against the response.
 *
 * Rubric mapping (must sum to 100):
 *   Routing Accuracy        20  →  derived from router result, not judge
 *   Reference Usage         15  →  passes that mention "references/..."
 *   Output Contract         25  →  required-outputs pass ratio
 *   Practicality            20  →  pass-criteria pass ratio
 *   Validation Readiness    10  →  mentions checklists/tests
 *   Conciseness / Control   10  →  forbidden violations subtract here
 */

import type { ScenarioManifestEntry, ScoreKey } from "@/lib/skill-builder/templates/tests-templates";
import type { RouteResult } from "./router";

export type CriterionVerdict = {
  text: string;
  status: "pass" | "warn" | "fail";
  evidence: string;
};

export type JudgeResult = {
  provider: "rule-based" | "ai";
  scenarioId: string;
  verdict: "PASS" | "NEEDS FIX";
  total: number;
  scores: Record<ScoreKey, number>;
  requiredOutputs: CriterionVerdict[];
  forbidden: CriterionVerdict[];
  passCriteria: CriterionVerdict[];
  notes: string;
};

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "to", "in", "on", "with",
  "is", "are", "be", "by", "at", "as", "this", "that", "it",
  // Korean common particles (very rough)
  "은", "는", "이", "가", "을", "를", "의", "에", "와", "과",
]);

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKC");
}

function contentTokens(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9가-힣\/.]+/u)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function overlapRatio(criterion: string, response: string): number {
  const tokens = contentTokens(criterion);
  if (tokens.length === 0) return 0;
  const respLc = normalize(response);
  const hits = tokens.filter((t) => respLc.includes(t)).length;
  return hits / tokens.length;
}

function statusFromRatio(ratio: number): "pass" | "warn" | "fail" {
  if (ratio >= 0.6) return "pass";
  if (ratio >= 0.3) return "warn";
  return "fail";
}

function evidenceLine(criterion: string, response: string): string {
  const tokens = contentTokens(criterion);
  const lc = normalize(response);
  const hit = tokens.find((t) => lc.includes(t));
  return hit ? `found token: "${hit}"` : "no signal";
}

/** Score how many "required outputs" the response covers. */
function judgeRequired(
  scenario: ScenarioManifestEntry,
  response: string,
): CriterionVerdict[] {
  return scenario.requiredOutputs.map((req) => {
    const ratio = overlapRatio(req, response);
    return {
      text: req,
      status: statusFromRatio(ratio),
      evidence: evidenceLine(req, response),
    };
  });
}

/** Detect forbidden-behavior signals in the response. */
function judgeForbidden(
  scenario: ScenarioManifestEntry,
  response: string,
): CriterionVerdict[] {
  // For forbidden lines, "high token overlap with the response" means the
  // model probably did the forbidden thing. Invert the status semantics:
  // pass = NOT violated, fail = violated.
  return scenario.forbidden.map((f) => {
    const ratio = overlapRatio(f, response);
    const violated = ratio >= 0.5;
    return {
      text: f,
      status: violated ? ("fail" as const) : ("pass" as const),
      evidence: violated
        ? evidenceLine(f, response)
        : "no forbidden signal detected",
    };
  });
}

function judgePassCriteria(
  scenario: ScenarioManifestEntry,
  response: string,
): CriterionVerdict[] {
  return scenario.passCriteria.map((c) => {
    const ratio = overlapRatio(c, response);
    return {
      text: c,
      status: statusFromRatio(ratio),
      evidence: evidenceLine(c, response),
    };
  });
}

function rubricScores(
  required: CriterionVerdict[],
  forbidden: CriterionVerdict[],
  passCriteria: CriterionVerdict[],
  response: string,
  routing: RouteResult | null,
): Record<ScoreKey, number> {
  // helpers — proportions
  const passProp = (rows: CriterionVerdict[]) => {
    if (rows.length === 0) return 1;
    const passes = rows.filter((r) => r.status === "pass").length;
    const warns = rows.filter((r) => r.status === "warn").length;
    return (passes + warns * 0.5) / rows.length;
  };
  const forbiddenPenalty = (rows: CriterionVerdict[]) => {
    if (rows.length === 0) return 0;
    return rows.filter((r) => r.status === "fail").length / rows.length;
  };

  // Routing slice (0-20): from router confidence
  const routingScore =
    routing?.confidence === "high"
      ? 20
      : routing?.confidence === "medium"
        ? 14
        : routing?.confidence === "low"
          ? 8
          : 0;

  // References slice (0-15): mentions of references/ or known reference file types
  const refMentions =
    /references\//i.test(response) ||
    /accessibility-checklist/i.test(response) ||
    /design-system-rules/i.test(response) ||
    /ux-principles/i.test(response) ||
    /ui-patterns/i.test(response);
  const referencesScore = refMentions ? 15 : 0;

  // Output Contract (0-25): proportional to required-output coverage
  const outputContractScore = Math.round(passProp(required) * 25);

  // Practicality (0-20): proportional to pass-criteria coverage
  const practicalityScore = Math.round(passProp(passCriteria) * 20);

  // Validation Readiness (0-10): mentions checklists or validation-log
  const validationReadinessScore =
    /checklists\/|validation-log|release-checklist/i.test(response) ? 10 : 0;

  // Conciseness / Control (0-10): start at 10, subtract for forbidden hits
  const concisenessScore = Math.max(
    0,
    Math.round(10 * (1 - forbiddenPenalty(forbidden))),
  );

  return {
    routing: routingScore,
    references: referencesScore,
    outputContract: outputContractScore,
    practicality: practicalityScore,
    validationReadiness: validationReadinessScore,
    conciseness: concisenessScore,
  };
}

export type JudgeOpts = {
  /** Optional router result; lets us award the routing slice. */
  routing?: RouteResult | null;
  /** Reserved for future AI provider plug. */
  provider?: "rule-based" | "ai";
};

export function judgeOutput(
  scenario: ScenarioManifestEntry,
  actualOutput: string,
  opts: JudgeOpts = {},
): JudgeResult {
  const response = actualOutput ?? "";
  const required = judgeRequired(scenario, response);
  const forbidden = judgeForbidden(scenario, response);
  const passCriteria = judgePassCriteria(scenario, response);
  const scores = rubricScores(
    required,
    forbidden,
    passCriteria,
    response,
    opts.routing ?? null,
  );
  const total =
    scores.routing +
    scores.references +
    scores.outputContract +
    scores.practicality +
    scores.validationReadiness +
    scores.conciseness;
  const forbiddenViolations = forbidden.filter((f) => f.status === "fail")
    .length;
  const verdict: "PASS" | "NEEDS FIX" =
    total >= 80 && forbiddenViolations === 0 ? "PASS" : "NEEDS FIX";
  const notes = response.trim()
    ? `Rule-based judge: ${required.filter((r) => r.status === "pass").length}/${required.length} required, ${forbiddenViolations} forbidden hits, ${passCriteria.filter((p) => p.status === "pass").length}/${passCriteria.length} pass criteria.`
    : "No actual output supplied — every criterion is failing by default.";
  return {
    provider: opts.provider ?? "rule-based",
    scenarioId: scenario.id,
    verdict,
    total,
    scores,
    requiredOutputs: required,
    forbidden,
    passCriteria,
    notes,
  };
}
