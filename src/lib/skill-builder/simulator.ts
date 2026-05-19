import type {
  CapabilityPack,
  SkillCategory,
  SkillConfig,
  WorkflowModule,
} from "@/types/skill";
import { WORKFLOW_BLOCKS } from "./blocks/workflow-blocks";
import { CAPABILITY_PACKS } from "./blocks/capability-packs";

// ─────────────────────────────────────────────────────────────────────────────
// Output shapes — JSON schemas the agent is expected to emit per workflow.
// Sourced from the deepened workflow blocks; falls back to a markdown spec
// for shallow blocks.
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUT_SHAPES: Partial<Record<WorkflowModule, string>> = {
  "problem-definition": `{
  "problem": "[Role] wants to [action] so that [outcome].",
  "user": { "role": "...", "context": "...", "knownState": "..." },
  "trigger": "...",
  "successCriteria": ["observable behavior 1", "..."],
  "unknowns": [{ "question": "...", "resolution": "ask" | "default" | "defer" }]
}`,
  "screen-design": `{
  "screen": "ScreenName",
  "purpose": "one sentence",
  "primaryAction": { "label": "...", "destination": "..." },
  "hierarchy": ["...", "..."],
  "components": [{ "name": "...", "purpose": "...", "variants": ["..."], "states": ["..."] }],
  "states": {
    "default": "...",
    "empty":   { "trigger": "no data", "design": "...", "nextStep": "..." },
    "loading": "skeleton shape",
    "error":   { "trigger": "...", "design": "...", "recovery": "..." }
  },
  "responsive": { "mobile": "...", "tablet": "...", "desktop": "..." }
}`,
  "ux-review": `{
  "summary": "one-line verdict",
  "findings": [
    {
      "id": "F-01",
      "category": "primary-action" | "hierarchy" | "states" | "accessibility" | "consistency" | "microcopy",
      "severity": "blocker" | "major" | "minor",
      "observation": "...",
      "impact": "...",
      "fix": "...",
      "effort": "S" | "M" | "L"
    }
  ],
  "prioritized": ["F-01", "F-02"]
}`,
  "user-flow": "Markdown — happy path + decision points + failure branches.",
  "information-architecture":
    "Markdown — screens, navigation model, content priority per screen.",
  "component-breakdown":
    "Markdown — reusable components with props/variants/states + responsive notes.",
  "design-system-draft":
    "Markdown — color/type/spacing/radius tokens + primitive list.",
  "figma-to-code":
    "Markdown — scene graph + node→component mapping + Tailwind outline.",
  "accessibility-check": "Markdown — WCAG AA checklist outcome per item.",
  "implementation-prompt":
    "Markdown — Cursor-ready prompt with framework, spec, acceptance criteria.",
  // Frontend
  "code-architecture":
    "Markdown — folder layout, data flow, module boundaries.",
  "component-implementation":
    "TSX component with full state coverage + test/story stub.",
  "state-management":
    "Markdown — classification (local/shared/server/URL) + tool choice.",
  "routing-strategy": "Markdown — URL shapes + code-split boundaries.",
  "performance-budget":
    "Markdown — LCP/CLS/JS targets + per-route plan to meet them.",
  "accessibility-implementation":
    "Markdown — semantic HTML map + focus order + reduced-motion plan.",
  // Design System
  "token-system": "JSON — raw + semantic tokens + Tailwind theme mapping.",
  "primitive-design":
    "Markdown — primitive list with props/variants/states/accessibility.",
  "variant-system":
    "Markdown — variant matrix per primitive with 4-tuple states.",
  "documentation-strategy":
    "Markdown — per-primitive doc shape + token table format.",
  "migration-plan":
    "Markdown — audit + priority + legacy/new coexistence rules.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Triage rules — keyword-driven pipeline selection
// ─────────────────────────────────────────────────────────────────────────────

type TriageRule = {
  id: string;
  reason: { en: string; ko: string };
  match: (q: string) => boolean;
  triggers: WorkflowModule[];
};

const re = (...patterns: string[]) =>
  new RegExp(patterns.join("|"), "i");

const TRIAGE_RULES: TriageRule[] = [
  {
    id: "figma-flow",
    reason: {
      en: "User provided a visual reference (screenshot / Figma).",
      ko: "사용자가 시각 레퍼런스(스크린샷·Figma)를 제공.",
    },
    match: (q) =>
      re(
        "figma",
        "screenshot",
        "스크린샷",
        "피그마",
        "image",
        "이미지",
      ).test(q),
    triggers: ["figma-to-code", "component-breakdown", "implementation-prompt"],
  },
  {
    id: "review-flow",
    reason: {
      en: "User asked for a review or audit of an existing artifact.",
      ko: "사용자가 기존 결과물의 리뷰·감사를 요청.",
    },
    match: (q) =>
      re("review", "audit", "리뷰", "검토", "감사", "평가", "개선").test(q),
    triggers: ["ux-review", "accessibility-check"],
  },
  {
    id: "design-system-flow",
    reason: {
      en: "User asked about design system / tokens / primitives.",
      ko: "사용자가 디자인 시스템·토큰·프리미티브를 언급.",
    },
    match: (q) =>
      re(
        "token",
        "토큰",
        "design system",
        "디자인 시스템",
        "primitive",
        "프리미티브",
      ).test(q),
    triggers: ["token-system", "primitive-design", "variant-system"],
  },
  {
    id: "frontend-impl-flow",
    reason: {
      en: "User asked for code / component implementation.",
      ko: "사용자가 코드·컴포넌트 구현을 요청.",
    },
    match: (q) =>
      re(
        "implement",
        "구현",
        "react",
        "component",
        "컴포넌트",
        "tailwind",
        "typescript",
      ).test(q),
    triggers: [
      "component-implementation",
      "state-management",
      "accessibility-implementation",
    ],
  },
  {
    id: "design-flow",
    reason: {
      en: "User asked to design a screen / feature.",
      ko: "사용자가 화면·기능 설계를 요청.",
    },
    match: (q) =>
      re("design", "디자인", "설계", "screen", "화면", "page", "페이지").test(
        q,
      ),
    triggers: [
      "problem-definition",
      "user-flow",
      "information-architecture",
      "screen-design",
      "component-breakdown",
      "implementation-prompt",
    ],
  },
];

const DEFAULT_PIPELINE: Record<SkillCategory, WorkflowModule[]> = {
  "ux-ui": [
    "problem-definition",
    "user-flow",
    "screen-design",
    "component-breakdown",
    "implementation-prompt",
  ],
  frontend: [
    "code-architecture",
    "component-implementation",
    "accessibility-implementation",
  ],
  "design-system": [
    "token-system",
    "primitive-design",
    "variant-system",
  ],
  harness: [],
  product: [],
  research: [],
  content: [],
  data: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// STOP gate heuristics — check whether the input plausibly satisfies the
// workflow's required inputs.
// ─────────────────────────────────────────────────────────────────────────────

function detectStopGates(
  workflowId: WorkflowModule,
  query: string,
): { rule: string; willTrigger: boolean }[] {
  const gates: { rule: string; willTrigger: boolean }[] = [];

  if (workflowId === "screen-design") {
    const hasAction = re(
      "primary",
      "action",
      "button",
      "cta",
      "기본",
      "주요",
      "주요 액션",
      "메인",
    ).test(query);
    gates.push({
      rule: "Primary action must be identifiable",
      willTrigger: !hasAction,
    });
    gates.push({
      rule: "All 4 states (default/empty/loading/error) must be specified",
      willTrigger: true, // always required to flag — agent must produce these
    });
  }

  if (workflowId === "ux-review") {
    const hasArtifact = re(
      "screenshot",
      "url",
      "link",
      "figma",
      "스크린",
      "화면",
      "이미지",
      "image",
    ).test(query);
    gates.push({
      rule: "Concrete artifact (screenshot / URL / code) must be provided",
      willTrigger: !hasArtifact,
    });
  }

  if (workflowId === "problem-definition") {
    const hasSuccess = re(
      "success",
      "성공",
      "결과",
      "완료",
      "done",
      "metric",
      "지표",
    ).test(query);
    gates.push({
      rule: "Observable success criteria must exist",
      willTrigger: !hasSuccess,
    });
  }

  if (workflowId === "implementation-prompt") {
    const hasFramework = re("react", "vue", "svelte", "next", "tailwind").test(
      query,
    );
    gates.push({
      rule: "Target framework should be implied or specified",
      willTrigger: !hasFramework,
    });
  }

  return gates;
}

// ─────────────────────────────────────────────────────────────────────────────
// References loaded — based on enabled packs + role flags
// ─────────────────────────────────────────────────────────────────────────────

function referencesFor(config: SkillConfig): string[] {
  const refs: string[] = ["references/ux-principles.md", "references/ui-patterns.md"];
  if (config.roleProfile.designSystemAwareness) {
    refs.push("references/design-system-rules.md");
  }
  if (config.qualityRules.includes("include-accessibility")) {
    refs.push("references/accessibility-checklist.md");
  }
  for (const packId of config.capabilityPacks) {
    const pack = CAPABILITY_PACKS.find((p) => p.id === packId);
    if (pack?.referenceFile) {
      refs.push(`references/${pack.referenceFile.fileName}`);
    }
  }
  return refs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token estimate — naive: 4 chars ≈ 1 token
// ─────────────────────────────────────────────────────────────────────────────

export function estimateSkillMdTokens(skillMdContent: string): number {
  if (!skillMdContent) return 0;
  return Math.round(skillMdContent.length / 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// Result types
// ─────────────────────────────────────────────────────────────────────────────

export type SimStep = {
  workflowId: WorkflowModule;
  title: string;
  outputShape: string;
  referencesLoaded: string[];
  stopGates: { rule: string; willTrigger: boolean }[];
};

export type Simulation = {
  query: string;
  category: SkillCategory;
  triageReason: string;
  steps: SimStep[];
  skipped: { id: WorkflowModule; title: string }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Run simulation
// ─────────────────────────────────────────────────────────────────────────────

export function simulate(
  query: string,
  config: SkillConfig,
  locale: "en" | "ko" = "en",
): Simulation {
  const fired = TRIAGE_RULES.filter((r) => r.match(query));

  let candidatePipeline: WorkflowModule[];
  let triageReason: string;

  if (fired.length > 0) {
    // Combine all fired pipelines, preserving order + de-duplicating
    candidatePipeline = [];
    for (const rule of fired) {
      for (const wf of rule.triggers) {
        if (!candidatePipeline.includes(wf)) candidatePipeline.push(wf);
      }
    }
    triageReason = fired.map((r) => r.reason[locale]).join(" · ");
  } else {
    candidatePipeline = DEFAULT_PIPELINE[config.category] ?? [];
    triageReason =
      locale === "ko"
        ? "매칭된 트리아지 규칙 없음 — 카테고리 기본 파이프라인으로 진행."
        : "No triage rule matched — falling back to category default pipeline.";
  }

  // Split into active (enabled in config) vs skipped (suggested but not enabled)
  const active = candidatePipeline.filter((w) =>
    config.workflowModules.includes(w),
  );
  const skippedIds = candidatePipeline.filter(
    (w) => !config.workflowModules.includes(w),
  );

  const refs = referencesFor(config);

  const steps: SimStep[] = active.map((wfId) => ({
    workflowId: wfId,
    title: WORKFLOW_BLOCKS[wfId]?.title ?? wfId,
    outputShape: OUTPUT_SHAPES[wfId] ?? "Markdown — see workflow content.",
    referencesLoaded: refs,
    stopGates: detectStopGates(wfId, query),
  }));

  const skipped = skippedIds.map((id) => ({
    id,
    title: WORKFLOW_BLOCKS[id]?.title ?? id,
  }));

  return {
    query,
    category: config.category,
    triageReason,
    steps,
    skipped,
  };
}

// Silence unused warning if CapabilityPack import isn't directly used elsewhere
void undefined as unknown as CapabilityPack;
