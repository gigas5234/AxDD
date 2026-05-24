import type { SkillPackageType, WorkflowStageId } from "@/types/skill";

export type RequiredFiles = {
  skillMd: boolean;
  catalogMd: boolean;
  readmeMd: boolean;
  workUnitJson: boolean;
  hooksJson: boolean;
  references: boolean;
  templates: boolean;
  checklists: boolean;
  tests: boolean;
  examples: boolean;
  // v0.1.3 — stub support for the remaining package types
  scripts: boolean;
  assets: boolean;
  metadata: boolean;
};

const blank: RequiredFiles = {
  skillMd: false,
  catalogMd: false,
  readmeMd: false,
  workUnitJson: false,
  hooksJson: false,
  references: false,
  templates: false,
  checklists: false,
  tests: false,
  examples: false,
  scripts: false,
  assets: false,
  metadata: false,
};

export const REQUIRED_FILES_BY_TYPE: Record<SkillPackageType, RequiredFiles> = {
  "simple-skill": { ...blank, skillMd: true, readmeMd: true },
  "reference-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    references: true,
  },
  "template-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    templates: true,
    examples: true,
  },
  "script-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    hooksJson: true,
    examples: true,
    scripts: true,
  },
  "asset-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    examples: true,
    assets: true,
  },
  "full-step-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: true,
    hooksJson: true,
    references: true,
    templates: true,
    checklists: true,
    tests: true,
    examples: true,
  },
  "metadata-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    hooksJson: true,
    metadata: true,
  },
  "test-skill": {
    ...blank,
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    checklists: true,
    tests: true,
  },
};

// Priority order for deriving the primary kit structure from a set of
// included skill types. Earlier in the list wins.
//
// Rationale for template > test: when a kit includes both, the headline
// artifact is the template (e.g. cursor-prompt-template) — tests are
// supporting validation. The Reference-Based Review preset omits
// template-skill, so it still resolves to test-skill correctly.
export const PRIMARY_PRIORITY: SkillPackageType[] = [
  "full-step-skill",
  "template-skill",
  "test-skill",
  "reference-skill",
  "script-skill",
  "asset-skill",
  "metadata-skill",
  "simple-skill",
];

export function derivePrimaryKitStructure(
  included: SkillPackageType[],
): SkillPackageType {
  for (const pt of PRIMARY_PRIORITY) {
    if (included.includes(pt)) return pt;
  }
  return "simple-skill";
}

export function mergeRequiredFiles(
  types: SkillPackageType[],
): RequiredFiles {
  const out: RequiredFiles = { ...blank };
  for (const pt of types) {
    const r = REQUIRED_FILES_BY_TYPE[pt];
    (Object.keys(out) as Array<keyof RequiredFiles>).forEach((k) => {
      if (r[k]) out[k] = true;
    });
  }
  return out;
}

export type StageMetadata = {
  id: WorkflowStageId;
  title: string;
  order: number;
  purpose: string;
  inputs: string[];
  outputs: string[];
  usesTemplates: string[];
  usesReferences: string[];
  usesChecklists: string[];
  exitCriteria: string[];
  entryCriteria: string[];
  procedure: string[];
  decisionRules: string[];
  qualityGate: string[];
  failureHandling: string[];
  nextStage: WorkflowStageId | null;
};

export const STAGE_METADATA: Record<WorkflowStageId, StageMetadata> = {
  "requirement-intake": {
    id: "requirement-intake",
    title: "Requirement Intake",
    order: 1,
    purpose:
      "Capture the product idea, constraints, target users, and success signals before any design work begins.",
    inputs: ["raw product idea", "stakeholder notes", "existing screenshots (optional)"],
    outputs: ["UX brief draft"],
    usesTemplates: ["templates/ux-brief-template.md"],
    usesReferences: ["references/stage-guides/requirement-intake-guide.md"],
    usesChecklists: [],
    exitCriteria: [
      "primary user, primary action, and success metric are explicitly named",
    ],
    entryCriteria: [
      "a user request, brief, or stakeholder note exists",
    ],
    procedure: [
      "restate the request as `[role] wants to [action] so that [outcome]`",
      "name the primary user precisely",
      "map the trigger and known state",
      "list unknowns with resolution=ask|default|defer",
      "define success as observable behavior",
    ],
    decisionRules: [
      "if the restate sentence does not fit in one line, split the problem",
      "if successCriteria contains a feeling, rewrite it",
      "if unknowns is empty and the request is <3 sentences, re-audit",
    ],
    qualityGate: [
      "primary user is named and precise",
      "primary action is a verb",
      "success metric is observable",
      "all unknowns have a resolution",
    ],
    failureHandling: [
      "missing required input → ASK the user",
      "fails gate → log in tests/validation-log-template.md and re-run",
    ],
    nextStage: "ux-foundation",
  },
  "ux-foundation": {
    id: "ux-foundation",
    title: "UX Foundation",
    order: 2,
    purpose:
      "Establish user flows, information architecture, and screen inventory.",
    inputs: ["UX brief"],
    outputs: ["user flow", "screen inventory", "IA outline"],
    usesTemplates: ["templates/ux-brief-template.md"],
    usesReferences: [
      "references/ux-principles.md",
      "references/stage-guides/ux-foundation-guide.md",
    ],
    usesChecklists: ["checklists/ux-foundation-checklist.md"],
    exitCriteria: ["each screen has a defined purpose and a primary action"],
    entryCriteria: ["Requirement Intake exit criteria are met"],
    procedure: [
      "list happy-path steps from entry to success",
      "mark every decision point with explicit branches",
      "annotate failure and empty states along the path",
      "enumerate every screen the flow touches",
      "define the navigation model (tabs/stack/modal)",
      "name each screen's one-sentence purpose and primary action",
    ],
    decisionRules: [
      "each screen has exactly one primary action",
      "every alternate branch must terminate",
      "a screen without a primary action does not belong in the flow",
    ],
    qualityGate: [
      "every screen lists a purpose and a primary action",
      "every decision point has at least one alternate branch",
      "every alternate branch terminates",
      "navigation model is named and consistent",
    ],
    failureHandling: [
      "two screens fight for the same primary action → merge or split",
      "alternate branch with no terminus → mark defer + log",
      "brief is too vague → return to Requirement Intake",
    ],
    nextStage: "ui-design-foundation",
  },
  "ui-design-foundation": {
    id: "ui-design-foundation",
    title: "UI Design Foundation",
    order: 3,
    purpose:
      "Define layout, hierarchy, components, and design-system-aware specifications per screen.",
    inputs: ["screen inventory"],
    outputs: ["screen specifications", "component breakdown", "design token draft"],
    usesTemplates: ["templates/screen-spec-template.md"],
    usesReferences: [
      "references/ui-patterns.md",
      "references/design-system-rules.md",
      "references/stage-guides/ui-design-foundation-guide.md",
    ],
    usesChecklists: ["checklists/ui-design-checklist.md"],
    exitCriteria: ["every screen lists default / empty / loading / error states"],
    entryCriteria: ["UX Foundation exit criteria are met"],
    procedure: [
      "open templates/screen-spec-template.md per screen",
      "name primary action first",
      "rank content priority (hierarchy)",
      "decompose into reusable, named components",
      "specify all 4 states (default/empty/loading/error)",
      "add responsive notes per breakpoint",
      "reference tokens, never raw values",
    ],
    decisionRules: [
      "if primary action is unclear, list candidates and ASK",
      "empty state without nextStep is broken",
      "error state must be describable in one sentence",
      "hierarchy >5 items → split the screen",
      '"same as desktop" is not a responsive decision',
    ],
    qualityGate: [
      "all 4 states present per screen",
      "empty has nextStep",
      "error has recovery",
      "tokens used everywhere",
      "responsive notes per breakpoint",
    ],
    failureHandling: [
      "fails gate → log + re-run the failing screen",
      "missing token → log in Open Issues and propose a token name",
      "single-use component → flag for next-stage review",
    ],
    nextStage: "prototype-planning",
  },
  "prototype-planning": {
    id: "prototype-planning",
    title: "Prototype Planning",
    order: 4,
    purpose:
      "Plan the prototype build, prefer Figma MCP, and prepare manual Figma instructions when MCP is blocked.",
    inputs: ["screen specifications", "component breakdown"],
    outputs: ["prototype plan", "Figma manual instructions"],
    usesTemplates: [
      "templates/figma-instruction-template.md",
      "templates/cursor-prompt-template.md",
    ],
    usesReferences: ["references/stage-guides/prototype-planning-guide.md"],
    usesChecklists: [],
    exitCriteria: ["a buildable plan exists for both MCP and manual paths"],
    entryCriteria: [
      "UI Design Foundation exit criteria are met for at least one screen",
    ],
    procedure: [
      "determine Figma MCP availability",
      "if blocked, fill templates/figma-instruction-template.md",
      "plan: pages → frames → grids → library components → tokens → states → spec export",
      "name each frame per breakpoint",
      "decide screens in scope for this iteration",
    ],
    decisionRules: [
      "if MCP is blocked, fall back to manual — do not stall",
      "do not detach library components unless required; log every detachment",
      "no hardcoded hex/px — log missing tokens",
    ],
    qualityGate: [
      "path named (mcp or manual)",
      "every in-scope screen has a frame per required breakpoint",
      "every open issue has an owner",
      "manual path has all prerequisites filled in",
    ],
    failureHandling: [
      "MCP intermittently fails → switch to manual",
      "missing library component → log + propose name",
      "spec changes mid-build → mark frame stale; re-run UI Design Foundation",
    ],
    nextStage: "review-validation",
  },
  "review-validation": {
    id: "review-validation",
    title: "Review & Validation",
    order: 5,
    purpose:
      "Run UX/UI review, accessibility checks, and sandbox validation before handoff.",
    inputs: ["screen specifications", "prototype plan"],
    outputs: ["review notes", "validation log"],
    usesTemplates: ["templates/design-review-template.md"],
    usesReferences: [
      "references/accessibility-checklist.md",
      "references/stage-guides/review-validation-guide.md",
    ],
    usesChecklists: ["checklists/ui-design-checklist.md"],
    exitCriteria: [
      "all blocking issues from sandbox-test-scenario are resolved or accepted",
    ],
    entryCriteria: [
      "Prototype Planning has produced at least one buildable frame",
    ],
    procedure: [
      "run primary action audit per screen",
      "run hierarchy audit",
      "run states audit (4 states present)",
      "run accessibility audit (AA contrast, keyboard, touch targets)",
      "run consistency audit",
      "run microcopy audit",
      "execute every scenario in tests/sandbox-test-scenario.md and log each result",
    ],
    decisionRules: [
      "if primary action audit fails, it is the top finding — stop the rest until resolved",
      "severity sort: blocker > major > minor",
      "no finding without an actionable fix",
      "scenario fail without accepted exception → gate fails",
    ],
    qualityGate: [
      "every screen passed primary action audit (or accepted)",
      "all sandbox scenarios pass or accepted",
      "accessibility AA met",
      "every finding has an owner",
    ],
    failureHandling: [
      "blocker → fix or accept with reason before advancing",
      "scenario fail → fix or add Accepted Exception with reviewer",
      "systemic problem → return to UI Design Foundation or UX Foundation",
    ],
    nextStage: "handoff",
  },
  handoff: {
    id: "handoff",
    title: "Handoff",
    order: 6,
    purpose:
      "Produce implementation-ready artifacts and release the kit output to engineering.",
    inputs: ["screen specifications", "review notes", "validation log"],
    outputs: ["implementation prompt", "handoff package"],
    usesTemplates: ["templates/cursor-prompt-template.md"],
    usesReferences: ["references/stage-guides/handoff-guide.md"],
    usesChecklists: [
      "checklists/handoff-checklist.md",
      "checklists/release-checklist.md",
    ],
    exitCriteria: ["release-checklist is fully ticked"],
    entryCriteria: ["Review & Validation gate passed"],
    procedure: [
      "fill templates/cursor-prompt-template.md per screen",
      "attach screen specs and validation log",
      "tick checklists/handoff-checklist.md",
      "tick checklists/release-checklist.md",
      "bump version in SKILL.md frontmatter",
      "hand off to engineering",
    ],
    decisionRules: [
      "do not ship with any unchecked item in release-checklist",
      "do not ship with unresolved blockers in the validation log",
      "do not ship without a versioned SKILL.md",
    ],
    qualityGate: [
      "release checklist fully ticked",
      "handoff checklist fully ticked",
      "no unresolved blockers",
      "version bumped",
      "owner + escalation documented",
    ],
    failureHandling: [
      "release checklist fails → fix missing items; do not bypass",
      "engineering reports ambiguity → return to UI Design Foundation and re-validate",
      "release rolled back → re-open Review & Validation with post-release findings",
    ],
    nextStage: null,
  },
};

export const ALL_STAGES: WorkflowStageId[] = [
  "requirement-intake",
  "ux-foundation",
  "ui-design-foundation",
  "prototype-planning",
  "review-validation",
  "handoff",
];
