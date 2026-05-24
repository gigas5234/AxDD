import type { SkillConfig } from "@/types/skill";

export type TestFileSpec = {
  fileName: string;
  /** Subdirectory inside `tests/`. Empty string = directly under tests/. */
  subPath?: "" | "scenarios" | "expected" | "scorecards";
  content: string;
  generatedFrom: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Top-level legacy files (shipped in every kit that has tests/)
// ─────────────────────────────────────────────────────────────────────────────

const SANDBOX_TEST = `# Sandbox Test Scenario

Repeatable scenarios used to validate this kit's output before release. Run each scenario, record the result in \`tests/validation-log-template.md\`, and gate **Review & Validation** on the outcome.

See \`tests/scenarios/\` for the input prompts and \`tests/expected/\` for the answer keys.
`;

const VALIDATION_LOG = `# Validation Log

Record one row per validation run. Keep history; do not overwrite prior rows.

| Run date   | Kit version | Scenario ID | Result | Score / 100 | Notes | Follow-up |
|------------|-------------|-------------|--------|-------------|-------|-----------|
| YYYY-MM-DD | 0.1.1       | ...         |        |             |       |           |

## Result legend

- **pass** — all criteria met.
- **warn** — non-blocking deviation; document the reason.
- **fail** — blocking deviation; must be resolved or formally accepted before release.

## Accepted exceptions

| Scenario ID | Reason accepted | Reviewer | Re-review date |
|-------------|-----------------|----------|----------------|
|             |                 |          |                |
`;

// ─────────────────────────────────────────────────────────────────────────────
// Scenario shape + manifest entries
// ─────────────────────────────────────────────────────────────────────────────

export type ScenarioManifestEntry = {
  id: string;
  fileName: string;
  title: string;
  inputPrompt: string;
  expectedRoute: string;
  requiredOutputs: string[];
  forbidden: string[];
  passCriteria: string[];
  /** Which presets ship this scenario inside their kit. */
  appliesTo: string[];
  /** Builder-level only — never emitted into a generated kit. */
  builderLevel?: boolean;
};

// ── Full-step (Standard Kit) scenarios — S001..S005 ──────────────────────────
const FULL_STEP_SCENARIOS: ScenarioManifestEntry[] = [
  {
    id: "S001",
    fileName: "S001-fresh-product-idea.md",
    title: "Fresh product idea",
    inputPrompt:
      '"I want an app that helps roommates split rent fairly each month."',
    expectedRoute: "hook-intake → requirement-intake",
    requiredOutputs: [
      "UX brief from templates/ux-brief-template.md",
      "Primary user / action / success metric named",
      "At least one unknown with a resolution",
    ],
    forbidden: [
      "Verbatim restatement",
      "Calling the user 'the customer'",
      "Skipping unknowns when input is short",
      "Jumping into screen design",
    ],
    passCriteria: [
      "Primary user is precise",
      "Primary action is a verb",
      "Success metric is observable",
      "All four brief sections populated",
      "No design output yet",
    ],
    appliesTo: ["ux-ui-axdd-default"],
  },
  {
    id: "S002",
    fileName: "S002-existing-screen-review.md",
    title: "Existing screen review",
    inputPrompt:
      '"Here is the signup screen for our app — what should we change?"',
    expectedRoute: "hook-review → review-validation",
    requiredOutputs: [
      "Filled design-review-template.md audit grid (6 audits)",
      "Findings with severity, observation, impact, fix, effort",
      "Prioritized list of finding IDs",
    ],
    forbidden: [
      "Taste-only commentary",
      "Findings without a fix",
      "Skipping accessibility audit",
      "Marking everything as blocker",
    ],
    passCriteria: [
      "Every audit row has a result",
      "Every finding has an actionable fix",
      "Accessibility reports contrast + keyboard",
      "Severity-sorted prioritization",
    ],
    appliesTo: ["ux-ui-axdd-default"],
  },
  {
    id: "S003",
    fileName: "S003-cursor-handoff.md",
    title: "Cursor handoff",
    inputPrompt:
      '"We are ready to ship the Rent Split screen. Hand this off to Cursor."',
    expectedRoute: "hook-handoff → handoff",
    requiredOutputs: [
      "Cursor prompt with Context / Goal / Spec / Tokens / Acceptance criteria",
      "Reference to checklists/release-checklist.md",
      "Reference to the screen specification",
    ],
    forbidden: [
      "Shipping without acceptance criteria",
      "Inventing tokens or component names",
      "Skipping the release checklist",
      "Vague 'build this screen' prompts",
    ],
    passCriteria: [
      "All five prompt sections populated",
      "≥ 6 acceptance-criteria items",
      "Release checklist referenced",
      "Out-of-scope section present",
    ],
    appliesTo: ["ux-ui-axdd-default"],
  },
  {
    id: "S004",
    fileName: "S004-figma-mcp-blocked.md",
    title: "Figma MCP blocked",
    inputPrompt:
      '"Figma MCP is blocked in our company. How do we prototype the Rent Split screen?"',
    expectedRoute: "hook-figma-mcp-blocked → prototype-planning (path=manual)",
    requiredOutputs: [
      "templates/figma-instruction-template.md selected",
      "Prerequisites populated",
      "All six manual build steps",
      "Parity checklist present",
    ],
    forbidden: [
      "'Just install Figma MCP' advice",
      "Detaching library components without logging",
      "Hardcoded values without flagging missing tokens",
    ],
    passCriteria: [
      "Manual path declared",
      "Every prerequisite has a value or 'TBD'",
      "All six build steps populated",
      "Parity checklist present",
    ],
    appliesTo: ["ux-ui-axdd-default"],
  },
  {
    id: "S005",
    fileName: "S005-ambiguous-request.md",
    title: "Ambiguous request",
    inputPrompt: '"Make it better."',
    expectedRoute: "ask — do not advance yet",
    requiredOutputs: [
      "A clarifying question (or short list)",
      "Question names the missing inputs (artifact, user, action, metric)",
    ],
    forbidden: [
      "Speculative design output",
      "Generic best-practice copy with no anchor",
      "Silently picking a stage",
    ],
    passCriteria: [
      "Response is a question",
      "Missing inputs are explicitly named",
      "No premature design or review output",
    ],
    appliesTo: ["ux-ui-axdd-default"],
  },
];

// ── Builder-level only ───────────────────────────────────────────────────────
const BUILDER_LEVEL_SCENARIOS: ScenarioManifestEntry[] = [
  {
    id: "S006",
    fileName: "S006-custom-skill-combination.md",
    title: "Custom skill combination",
    inputPrompt:
      '"Design the Settings screen." (Custom kit: [reference, template] only.)',
    expectedRoute:
      "No workflow stage — direct use of templates/screen-spec-template.md",
    requiredOutputs: [
      "Screen spec following the template contract",
      "Output paths exist in the kit",
    ],
    forbidden: [
      "Referencing checklists/, tests/, WORK_UNIT.json, HOOKS.json",
      "Pretending workflow stages exist",
      "Invoking validation gates this kit does not ship",
    ],
    passCriteria: [
      "Screen spec meets exit criteria",
      "No phantom file references",
      "No validation gate invoked",
    ],
    appliesTo: [],
    builderLevel: true,
  },
];

// ── Cursor Handoff Kit scenarios — C001..C004 ────────────────────────────────
const CURSOR_HANDOFF_SCENARIOS: ScenarioManifestEntry[] = [
  {
    id: "C001",
    fileName: "C001-screen-spec-to-cursor-prompt.md",
    title: "Screen spec → Cursor prompt",
    inputPrompt:
      '"Turn this screen-spec.md into a Cursor-ready prompt." (User attaches a completed screen spec.)',
    expectedRoute:
      "Use templates/cursor-prompt-template.md directly. No workflow routing in this kit.",
    requiredOutputs: [
      "Filled templates/cursor-prompt-template.md (Context / Goal / Spec / Tokens / Acceptance criteria / Output / Out of scope)",
      "Embedded or referenced screen spec from templates/screen-spec-template.md",
      "Acceptance criteria covering primary action, all 4 states, responsive, a11y, tokens",
    ],
    forbidden: [
      "Inventing components / tokens not in the screen spec",
      "Routing language ('hook-handoff', 'stage handoff') — this kit has no workflow",
      "Vague 'build this screen' prompts",
    ],
    passCriteria: [
      "All five prompt sections populated",
      "≥ 6 acceptance-criteria items",
      "Tokens listed (no raw values)",
      "Out-of-scope section present",
    ],
    appliesTo: ["axdd-cursor-handoff-kit"],
  },
  {
    id: "C002",
    fileName: "C002-incomplete-screen-spec.md",
    title: "Incomplete screen spec → ASK, not guess",
    inputPrompt:
      '"Hand off this screen." (User pastes a partial screen spec missing empty / loading / error states.)',
    expectedRoute:
      "ASK for missing states before producing a Cursor prompt — do not proceed.",
    requiredOutputs: [
      "Explicit list of missing screen-spec sections (e.g. empty state nextStep, error recovery)",
      "Pointer to templates/screen-spec-template.md exit criteria",
    ],
    forbidden: [
      "Producing a Cursor prompt with placeholder acceptance criteria",
      "Inventing the missing states",
      "Skipping the screen-spec exit criteria check",
    ],
    passCriteria: [
      "Response names the missing screen-spec sections explicitly",
      "No Cursor prompt produced yet",
      "Reference to screen-spec-template.md exit criteria",
    ],
    appliesTo: ["axdd-cursor-handoff-kit"],
  },
  {
    id: "C003",
    fileName: "C003-token-mapping-check.md",
    title: "Token mapping check",
    inputPrompt:
      '"Generate the Cursor prompt for the Result screen — use our tokens." (User attaches token file or import path.)',
    expectedRoute:
      "templates/cursor-prompt-template.md, with Tokens section filled from the provided source.",
    requiredOutputs: [
      "Tokens section references the import path (no hex / px values inlined)",
      "Acceptance criteria explicitly requires 'all styling uses tokens; no raw values outside spec'",
      "If a needed token is missing, an Open Issue row in the prompt's assumptions block",
    ],
    forbidden: [
      "Hardcoded hex / px in the prompt",
      "Inventing token names not in the source",
      "Silent fallback to raw values",
    ],
    passCriteria: [
      "Tokens section uses only the provided source",
      "No raw values in the prompt body",
      "Missing-token concerns are flagged, not hidden",
    ],
    appliesTo: ["axdd-cursor-handoff-kit"],
  },
  {
    id: "C004",
    fileName: "C004-acceptance-criteria-check.md",
    title: "Acceptance criteria check",
    inputPrompt:
      '"Is the Cursor prompt for the Entry screen ready to ship?" (User attaches a draft prompt.)',
    expectedRoute:
      "Audit the draft against checklists/handoff-checklist.md and checklists/release-checklist.md.",
    requiredOutputs: [
      "Checklist of present / missing acceptance criteria",
      "Reference to checklists/handoff-checklist.md (every item)",
      "Reference to checklists/release-checklist.md as the final gate",
      "Verdict: ready / fix-and-reship / re-design",
    ],
    forbidden: [
      "Approving a draft with unticked release-checklist items",
      "Marking 'ready' without listing what was checked",
      "Suggesting workflow stage advances ('move to next stage') — there is no workflow in this kit",
    ],
    passCriteria: [
      "Every release-checklist item has a present / missing mark",
      "Every handoff-checklist item has a present / missing mark",
      "Verdict is named",
      "No phantom file references (HOOKS / WORK_UNIT not mentioned)",
    ],
    appliesTo: ["axdd-cursor-handoff-kit"],
  },
];

// ── Reference Review Kit scenarios — R001..R005 ──────────────────────────────
const REFERENCE_REVIEW_SCENARIOS: ScenarioManifestEntry[] = [
  {
    id: "R001",
    fileName: "R001-review-existing-screen.md",
    title: "Review an existing screen",
    inputPrompt:
      '"Review the signup screen against our UX/UI references." (User attaches a screenshot or describes the screen.)',
    expectedRoute:
      "templates/design-review-template.md (no workflow stage — this kit has no WORK_UNIT/HOOKS).",
    requiredOutputs: [
      "Filled design-review-template.md audit grid (6 audits)",
      "Each finding cites the reference it relies on (e.g. references/ux-principles.md)",
      "Prioritized list of finding IDs",
    ],
    forbidden: [
      "Taste-only commentary",
      "Findings without an actionable fix",
      "Routing language ('hook-review', 'stage review-validation') — this kit has no workflow",
      "Referencing files this kit does not ship (templates/cursor-prompt-template.md, WORK_UNIT.json, HOOKS.json)",
    ],
    passCriteria: [
      "Every audit row has a result",
      "Every finding has a fix and cites a reference",
      "Prioritization present",
    ],
    appliesTo: ["axdd-ux-ui-reference-review"],
  },
  {
    id: "R002",
    fileName: "R002-accessibility-review.md",
    title: "Accessibility review",
    inputPrompt:
      '"Audit this screen for accessibility — keyboard, contrast, touch targets."',
    expectedRoute:
      "templates/design-review-template.md, accessibility row of the audit grid; cite references/accessibility-checklist.md.",
    requiredOutputs: [
      "Contrast verdict for body (≥ 4.5:1) and large text / icons (≥ 3:1)",
      "Keyboard reachability + visible focus assessment",
      "Touch target minimums (mobile ≥ 44px / desktop ≥ 32px)",
      "Each finding references the accessibility-checklist line that backs it",
    ],
    forbidden: [
      "Generic 'add aria labels' without naming which elements",
      "Skipping any of contrast / keyboard / touch targets",
      "Referencing WORK_UNIT.json, HOOKS.json, or stage routing",
    ],
    passCriteria: [
      "All three sub-audits reported",
      "Every finding cites accessibility-checklist.md",
      "Recovery / fix is concrete",
    ],
    appliesTo: ["axdd-ux-ui-reference-review"],
  },
  {
    id: "R003",
    fileName: "R003-design-system-alignment.md",
    title: "Design-system alignment",
    inputPrompt:
      '"Does this screen follow our design system rules?" (User describes or attaches the screen.)',
    expectedRoute:
      "templates/design-review-template.md, consistency / hierarchy audit rows; cite references/design-system-rules.md and references/ui-patterns.md.",
    requiredOutputs: [
      "Token usage findings (color / type / spacing / radius)",
      "Component variant findings (cite ds-variants-cap-5 if exceeded)",
      "Each finding cites design-system-rules.md or ui-patterns.md",
    ],
    forbidden: [
      "Recommending new tokens without flagging that they don't exist yet",
      "Findings about workflow / pipelines (not in scope of this kit)",
      "Phantom file references",
    ],
    passCriteria: [
      "Tokens, primitives, and variants are all addressed",
      "Every finding cites a reference path that exists in this kit",
    ],
    appliesTo: ["axdd-ux-ui-reference-review"],
  },
  {
    id: "R004",
    fileName: "R004-prioritized-issue-list.md",
    title: "Prioritized issue list",
    inputPrompt:
      '"Turn the review findings into a prioritized fix list."',
    expectedRoute:
      "Reorder the findings by severity > (impact / effort) — produce an actionable list.",
    requiredOutputs: [
      "Ordered list of findings with: id / severity / impact / effort / fix / owner",
      "A short summary verdict (ship / fix-and-reship / re-design)",
    ],
    forbidden: [
      "Findings without owners",
      "All-blocker lists ('everything is critical')",
      "Routing language ('hook-handoff', stage names) — this kit has no workflow",
    ],
    passCriteria: [
      "Severity sort applied",
      "Every finding has owner + actionable fix",
      "Summary verdict named",
    ],
    appliesTo: ["axdd-ux-ui-reference-review"],
  },
  {
    id: "R005",
    fileName: "R005-handoff-readiness-review.md",
    title: "Handoff readiness review",
    inputPrompt:
      '"Is this screen ready for engineering handoff?" (User attaches the screen + any existing spec.)',
    expectedRoute:
      "Audit against checklists/ui-design-checklist.md and checklists/handoff-checklist.md.",
    requiredOutputs: [
      "Per-checklist item: present / missing / accepted-exception",
      "Verdict: ready / fix-and-reship / re-design",
      "Pointer to checklists/release-checklist.md as the final gate",
    ],
    forbidden: [
      "Marking 'ready' without listing what was checked",
      "Referencing templates/cursor-prompt-template.md (this kit does not ship it)",
      "Referencing WORK_UNIT.json or HOOKS.json",
    ],
    passCriteria: [
      "Every checklist item has a status",
      "Verdict named",
      "Only files shipped by this kit are referenced",
    ],
    appliesTo: ["axdd-ux-ui-reference-review"],
  },
];

export const SCENARIO_MANIFEST: ScenarioManifestEntry[] = [
  ...FULL_STEP_SCENARIOS,
  ...CURSOR_HANDOFF_SCENARIOS,
  ...REFERENCE_REVIEW_SCENARIOS,
  ...BUILDER_LEVEL_SCENARIOS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Render scenario / expected markdown from a manifest entry
// ─────────────────────────────────────────────────────────────────────────────

function renderScenarioMd(s: ScenarioManifestEntry): string {
  const lines: string[] = [];
  lines.push(`# ${s.id} — ${s.title}`, "");
  lines.push("## Input prompt");
  lines.push(`> ${s.inputPrompt}`, "");
  lines.push("## Expected route");
  lines.push(s.expectedRoute, "");
  lines.push("## Required outputs");
  for (const o of s.requiredOutputs) lines.push(`- ${o}`);
  lines.push("");
  lines.push("## Forbidden");
  for (const f of s.forbidden) lines.push(`- ${f}`);
  lines.push("");
  lines.push("## Pass criteria");
  for (const p of s.passCriteria) lines.push(`- [ ] ${p}`);
  lines.push("");
  lines.push(`See \`tests/expected/${s.fileName}\` for the answer key.`);
  return lines.join("\n");
}

function renderExpectedMd(s: ScenarioManifestEntry): string {
  const lines: string[] = [];
  lines.push(`# ${s.id} — Expected output`, "");
  lines.push("## Expected route");
  lines.push(`\`${s.expectedRoute}\``, "");
  lines.push("## Required outputs");
  for (const o of s.requiredOutputs) lines.push(`- ${o}`);
  lines.push("");
  lines.push("## Forbidden behavior");
  for (const f of s.forbidden) lines.push(`- ${f}`);
  lines.push("");
  lines.push("## Pass criteria (binary)");
  for (const p of s.passCriteria) lines.push(`- [ ] ${p}`);
  lines.push("");
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Scorecards — shared across presets
// ─────────────────────────────────────────────────────────────────────────────

const SCORECARDS: { fileName: string; content: string }[] = [
  {
    fileName: "routing-scorecard.md",
    content: `# Routing Scorecard

Score how well the skill routes incoming requests to the correct artifact / route.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Did the skill identify the correct route / artifact? | wrong | partial | correct |
| Did the skill respect what the kit ships (no phantom files)? | referenced phantom | partial | only real files |
| Did the skill respect routing context requirements? | ignored | partial | yes |
| Did the skill respect skip conditions? | ignored | partial | yes |
| Did the skill produce a clear fallback when routing was uncertain? | no | partial | yes |

Max points: **10**. Scales to the 20-point \`Routing Accuracy\` rubric slice.
`,
  },
  {
    fileName: "output-contract-scorecard.md",
    content: `# Output Contract Scorecard

Score how strictly the skill respected the relevant template's output contract.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Are all required sections present? | missing several | one missing | complete |
| Are field types correct (verb vs noun, observable vs feeling)? | many wrong | a few wrong | correct |
| Are required states / branches covered (4-tuple, etc.)? | missing several | one missing | complete |
| Are tokens / references used instead of raw values? | raw | mixed | only tokens |
| Are accessibility minimums met? | not addressed | partial | addressed |

Max points: **10**. Scales to the 25-point \`Output Contract\` slice.
`,
  },
  {
    fileName: "handoff-readiness-scorecard.md",
    content: `# Handoff Readiness Scorecard

Score whether the downstream engineer / agent can act on the output without re-asking.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Are acceptance criteria concrete and observable? | no | partial | yes |
| Is the source spec attached or referenced by path? | no | partial | yes |
| Are tokens / theme references included? | no | partial | yes |
| Is out-of-scope explicit? | no | implicit | explicit |
| Is the final release gate ticked or referenced? | no | partial | yes |

Max points: **10**. Scales to the 20-point \`Practicality\` slice.
`,
  },
  {
    fileName: "practical-quality-scorecard.md",
    content: `# Practical Quality Scorecard

Score practical quality beyond contract compliance.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Did the skill ask for missing inputs instead of guessing? | guessed | partial | asked |
| Did the skill stay concise where appropriate? | too long | mixed | concise |
| Did the skill avoid taste-only commentary? | taste-heavy | a little | actionable only |
| Did the skill mention the validation gate / log? | no | implicit | explicit |
| Did the skill respect what the kit does NOT ship? | phantom refs | mixed | only real files |

Max points: **10**. Splits across \`Practicality\` + \`Validation Readiness\` + \`Conciseness / Control\` (10 each).
`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Per-preset selector
// ─────────────────────────────────────────────────────────────────────────────

function scenariosForConfig(config: SkillConfig): ScenarioManifestEntry[] {
  const id = config.id;
  if (id === "axdd-cursor-handoff-kit") return CURSOR_HANDOFF_SCENARIOS;
  if (id === "axdd-ux-ui-reference-review") return REFERENCE_REVIEW_SCENARIOS;
  // Standard Kit (full-step) — ships the canonical 5 scenarios.
  if (config.includedSkillTypes.includes("full-step-skill")) {
    return FULL_STEP_SCENARIOS;
  }
  // Presets without a dedicated scenario set ship no /scenarios or
  // /expected (would otherwise reference paths this kit does not ship).
  // The top-level sandbox-test-scenario.md still ships under tests/.
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Public builder
// ─────────────────────────────────────────────────────────────────────────────

export function buildTestFiles(config: SkillConfig): TestFileSpec[] {
  const out: TestFileSpec[] = [
    {
      fileName: "sandbox-test-scenario.md",
      subPath: "",
      content: SANDBOX_TEST,
      generatedFrom: ["test-sandbox"],
    },
    {
      fileName: "validation-log-template.md",
      subPath: "",
      content: VALIDATION_LOG,
      generatedFrom: ["test-validation-log"],
    },
  ];
  const scenarios = scenariosForConfig(config);
  for (const s of scenarios) {
    out.push({
      fileName: s.fileName,
      subPath: "scenarios",
      content: renderScenarioMd(s),
      generatedFrom: [`scenario-${s.id}`],
    });
    out.push({
      fileName: s.fileName,
      subPath: "expected",
      content: renderExpectedMd(s),
      generatedFrom: [`expected-${s.id}`],
    });
  }
  for (const c of SCORECARDS) {
    out.push({
      fileName: c.fileName,
      subPath: "scorecards",
      content: c.content,
      generatedFrom: [`scorecard-${c.fileName.replace(/\.[^.]+$/, "")}`],
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rubric (used by the Validation Lab UI)
// ─────────────────────────────────────────────────────────────────────────────

export const SCORE_RUBRIC = [
  { key: "routing", label: "Routing Accuracy", max: 20 },
  { key: "references", label: "Reference Usage", max: 15 },
  { key: "outputContract", label: "Output Contract", max: 25 },
  { key: "practicality", label: "Practicality", max: 20 },
  { key: "validationReadiness", label: "Validation Readiness", max: 10 },
  { key: "conciseness", label: "Conciseness / Control", max: 10 },
] as const;

export type ScoreKey = (typeof SCORE_RUBRIC)[number]["key"];
