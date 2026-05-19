import type { QualityRule, SkillBlock, SkillCategory } from "@/types/skill";

const RULE_TEXT: Record<QualityRule, string> = {
  // Universal
  "avoid-vague-language":
    "Do not use vague words like modern, clean, intuitive, or premium without concrete design rules.",
  "avoid-unnecessary-questions":
    "Do not ask the user for information that can be reasonably inferred from context.",
  "avoid-overlong-chat-response":
    "Do not produce a sprawling chat response when a tight, structured answer would do.",

  // UX/UI
  "define-primary-action": "Always define the primary user action on every screen.",
  "include-information-hierarchy":
    "Always rank content priority and produce an information hierarchy.",
  "include-screen-states":
    "Always specify default, empty, loading, and error states for every screen.",
  "componentize-output": "Always break screens into reusable, named components.",
  "include-responsive-notes":
    "Always include responsive notes covering mobile, tablet, and desktop breakpoints.",
  "include-accessibility":
    "Always include accessibility considerations (contrast, focus, semantics).",

  // Frontend Implementation
  "fe-no-any":
    "Never use `any`. Use `unknown` and narrow at the boundary; named types over inline.",
  "fe-compose-over-branch":
    "Compose components instead of branching on a `variant` prop with 4+ values.",
  "fe-test-users-not-impl":
    "Test what users perceive — queries by role / label / text — not implementation details.",
  "fe-semantic-html-first":
    "Use semantic HTML first; reach for ARIA only when semantics fall short.",
  "fe-perf-budget":
    "Enforce a performance budget: LCP < 2.5s, CLS = 0 above the fold, JS < 250KB initial.",
  "fe-state-colocation":
    "Colocate state at the lowest common ancestor; promote to context only when ≥3 unrelated subtrees need it.",

  // Design System Generator
  "ds-semantic-tokens":
    "Tokens are semantic (surface, ink, accent), never literal (blue-500, gray-200).",
  "ds-no-business-in-primitive":
    "Primitives have no business logic — only presentation and interaction.",
  "ds-variants-cap-5":
    "Cap variants per primitive at 5; more means a missing primitive.",
  "ds-states-4tuple":
    "All interactive states are a 4-tuple: default / hover / active / disabled.",
  "ds-doc-canonical-usage":
    "Document one canonical usage per component; avoid kitchen-sink demos.",
};

export function ruleBlocks(rules: QualityRule[]): SkillBlock[] {
  return rules.map((r) => ({
    id: `rule-${r}`,
    category: "rule",
    title: r,
    description: "Quality rule",
    content: RULE_TEXT[r],
  }));
}

export function ruleLines(rules: QualityRule[]): string[] {
  return rules.map((r) => `- ${RULE_TEXT[r]}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Which quality rules apply to which category
// Universal rules are included in every active category.
// ─────────────────────────────────────────────────────────────────────────────

const UNIVERSAL: QualityRule[] = [
  "avoid-vague-language",
  "avoid-unnecessary-questions",
  "avoid-overlong-chat-response",
];

const UX_UI_RULES: QualityRule[] = [
  ...UNIVERSAL,
  "define-primary-action",
  "include-information-hierarchy",
  "include-screen-states",
  "componentize-output",
  "include-responsive-notes",
  "include-accessibility",
];

const FRONTEND_RULES: QualityRule[] = [
  ...UNIVERSAL,
  "fe-no-any",
  "fe-compose-over-branch",
  "fe-test-users-not-impl",
  "fe-semantic-html-first",
  "fe-perf-budget",
  "fe-state-colocation",
  "componentize-output", // applies to FE too (component breakdown)
  "include-accessibility", // applies to FE too
  "include-responsive-notes",
];

const DESIGN_SYSTEM_RULES_LIST: QualityRule[] = [
  ...UNIVERSAL,
  "ds-semantic-tokens",
  "ds-no-business-in-primitive",
  "ds-variants-cap-5",
  "ds-states-4tuple",
  "ds-doc-canonical-usage",
  "include-accessibility",
  "componentize-output",
];

const HARNESS_RULES: QualityRule[] = [...UNIVERSAL];

export const RULES_BY_CATEGORY: Record<SkillCategory, QualityRule[]> = {
  "ux-ui": UX_UI_RULES,
  frontend: FRONTEND_RULES,
  "design-system": DESIGN_SYSTEM_RULES_LIST,
  harness: HARNESS_RULES,
  product: [],
  research: [],
  content: [],
  data: [],
};
