/**
 * AXDD Router — reads a kit's HOOKS.json and resolves an incoming user
 * input to a hook + its routeTo target. Deterministic; no AI involved.
 *
 * Match policy (in order, first-win):
 *   1. Exact keyword match against any of a hook's `triggers` (case-insensitive).
 *      Trigger types: "keyword" (substring) and "intent" (substring or phrase).
 *   2. Fuzzy token match — count tokens in the input that appear in any trigger.
 *      Hook with the highest token overlap wins; ties broken by hook order.
 *   3. Fallback to the hook's `fallbackStage` if no signal at all.
 *
 * If `requiresContext` is non-empty, the router lowers confidence and emits
 * a "missing context" hint instead of routing blindly.
 */

import type { WorkflowStageId } from "@/types/skill";

export type HookDef = {
  id: string;
  triggerType: "keyword" | "intent";
  triggers: string[];
  routeTo: {
    stage?: WorkflowStageId;
    template?: string;
    reference?: string;
    checklist?: string;
  };
  confidence?: "high" | "medium" | "low";
  fallbackStage?: WorkflowStageId | null;
  requiresContext?: string[];
  skipIf?: string[];
  description?: string;
};

export type HooksFile = {
  kitName: string;
  hooks: HookDef[];
};

export type RouteResult = {
  matchedHookId: string | null;
  route: HookDef["routeTo"] | null;
  matchedKeywords: string[];
  confidence: "high" | "medium" | "low" | "none";
  fallbackStage: WorkflowStageId | null;
  /** When set, the router believes the input is missing required context. */
  missingContext: string[];
  /** Free-form reason — useful in the UI / log. */
  reason: string;
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKC");
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9가-힣]+/u)
    .filter(Boolean);
}

function exactTriggerHit(input: string, hook: HookDef): string[] {
  const lc = normalize(input);
  return hook.triggers.filter((t) => lc.includes(normalize(t)));
}

function tokenOverlap(input: string, hook: HookDef): number {
  const inputTokens = new Set(tokenize(input));
  let hits = 0;
  for (const t of hook.triggers) {
    for (const tok of tokenize(t)) {
      if (inputTokens.has(tok)) hits++;
    }
  }
  return hits;
}

export function routeRequest(input: string, hooks: HooksFile): RouteResult {
  if (!input.trim() || hooks.hooks.length === 0) {
    return {
      matchedHookId: null,
      route: null,
      matchedKeywords: [],
      confidence: "none",
      fallbackStage: null,
      missingContext: [],
      reason: "no input or no hooks configured",
    };
  }

  // 1) Exact substring hit on a trigger.
  for (const hook of hooks.hooks) {
    const hits = exactTriggerHit(input, hook);
    if (hits.length > 0) {
      const missingContext = (hook.requiresContext ?? []).filter(
        (ctx) => !normalize(input).includes(normalize(ctx)),
      );
      return {
        matchedHookId: hook.id,
        route: hook.routeTo,
        matchedKeywords: hits,
        confidence:
          missingContext.length > 0
            ? "low"
            : (hook.confidence ?? "high"),
        fallbackStage: hook.fallbackStage ?? null,
        missingContext,
        reason:
          missingContext.length > 0
            ? `matched ${hook.id} on "${hits.join(", ")}" — but missing context: ${missingContext.join(", ")}`
            : `matched ${hook.id} on "${hits.join(", ")}"`,
      };
    }
  }

  // 2) Best fuzzy overlap.
  let best: { hook: HookDef; score: number } | null = null;
  for (const hook of hooks.hooks) {
    const score = tokenOverlap(input, hook);
    if (score > 0 && (!best || score > best.score)) {
      best = { hook, score };
    }
  }
  if (best) {
    const hook = best.hook;
    return {
      matchedHookId: hook.id,
      route: hook.routeTo,
      matchedKeywords: [],
      confidence: "low",
      fallbackStage: hook.fallbackStage ?? null,
      missingContext: hook.requiresContext ?? [],
      reason: `fuzzy match on ${hook.id} (${best.score} token overlap) — no exact trigger hit`,
    };
  }

  // 3) Nothing matched.
  return {
    matchedHookId: null,
    route: null,
    matchedKeywords: [],
    confidence: "none",
    fallbackStage: null,
    missingContext: [],
    reason: "no hook matched — caller should ASK or use a default",
  };
}

/**
 * Convenience: load HOOKS.json from a generated package's content blob.
 * Throws if the content is malformed.
 */
export function parseHooks(jsonContent: string): HooksFile {
  return JSON.parse(jsonContent) as HooksFile;
}
