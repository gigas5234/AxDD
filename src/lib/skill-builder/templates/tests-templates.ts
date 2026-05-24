export type TestFileSpec = {
  fileName: string;
  /** Subdirectory inside `tests/`. Empty string = directly under tests/. */
  subPath?: "" | "scenarios" | "expected" | "scorecards";
  content: string;
  generatedFrom: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Legacy top-level scenarios + validation log (kept for back-compat)
// ─────────────────────────────────────────────────────────────────────────────

const SANDBOX_TEST = `# Sandbox Test Scenario

Repeatable scenarios used to validate this kit's output before release. Run each scenario, record the result in \`tests/validation-log-template.md\`, and gate **Review & Validation** on the outcome.

## How to add a scenario

Copy a block from \`tests/scenarios/\` (S001..S006), give it a unique ID, and fill it in.

See:
- \`tests/scenarios/\`   — input prompts
- \`tests/expected/\`    — expected route, outputs, forbidden behavior, pass criteria
- \`tests/scorecards/\`  — rubric per concern (routing, output contract, handoff, practical quality)
`;

const VALIDATION_LOG = `# Validation Log

Record one row per validation run. Keep history; do not overwrite prior rows.

| Run date   | Kit version | Scenario ID | Result | Score / 100 | Notes | Follow-up |
|------------|-------------|-------------|--------|-------------|-------|-----------|
| YYYY-MM-DD | 0.1.1       | S001        | pass   |             |       |           |
| YYYY-MM-DD | 0.1.1       | S002        | warn   |             |       |           |

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
// Scenarios — tests/scenarios/
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIOS: { fileName: string; content: string }[] = [
  {
    fileName: "S001-fresh-product-idea.md",
    content: `# S001 — Fresh product idea

## Purpose
Verify the skill routes a rough product idea into the Requirement Intake stage and produces a real brief, not a generic restatement.

## Input prompt
> "I want an app that helps roommates split rent fairly each month."

## Expected behavior
- Route into \`requirement-intake\` (via \`hook-intake\`).
- Produce a UX brief filling \`templates/ux-brief-template.md\`.
- Name the primary user, the primary action, and the success metric explicitly.
- List at least one unknown with a resolution (\`ask\` / \`default\` / \`defer\`).

## Forbidden
- Restating the prompt verbatim.
- Calling the user "the customer" or other vague labels.
- Skipping unknowns when the brief is shorter than 3 sentences.
- Jumping into screen design before the brief is approved.

## Pass criteria
- Primary user is precise (not "user" / "customer").
- Primary action is a verb.
- Success metric is observable.
- All four sections of the brief are populated (problem / user / success / unknowns).
- No design output yet.

See \`tests/expected/S001-fresh-product-idea.md\` for the canonical answer key.
`,
  },
  {
    fileName: "S002-existing-screen-review.md",
    content: `# S002 — Existing screen review

## Purpose
Verify the skill routes a "review this screen" request into Review & Validation and produces an actionable audit (not taste opinions).

## Input prompt
> "Here's the signup screen for our app — what should we change?"
> (User attaches a screenshot or describes the screen.)

## Expected behavior
- Route into \`review-validation\` (via \`hook-review\`).
- Open \`templates/design-review-template.md\` and fill the audit grid for all six audits (primary action, hierarchy, states, accessibility, consistency, microcopy).
- Produce findings with severity (blocker / major / minor) and an actionable fix per finding.
- Prioritize findings by severity, then impact ÷ effort.

## Forbidden
- Taste-only commentary ("I'd use a different blue").
- Findings without an actionable fix.
- Skipping accessibility audit.
- Treating every minor inconsistency as a blocker.

## Pass criteria
- Every audit category has a result.
- At least one finding has a concrete \`fix\` line.
- Prioritized list is present.
- Accessibility audit reports at least contrast + keyboard reachability.
`,
  },
  {
    fileName: "S003-cursor-handoff.md",
    content: `# S003 — Cursor handoff

## Purpose
Verify the skill routes a "ship to engineering" request into Handoff and produces an implementation-ready Cursor prompt.

## Input prompt
> "We're ready to ship the Rent Split screen. Hand this off to Cursor."

## Expected behavior
- Route into \`handoff\` (via \`hook-handoff\`).
- Fill \`templates/cursor-prompt-template.md\` with: product / screen / framework / design system / spec / tokens / acceptance criteria.
- Surface \`checklists/release-checklist.md\` and confirm it is ticked.
- Reference the screen specification by path (or include it inline).

## Forbidden
- Shipping without acceptance criteria.
- Inventing tokens or component names not in the spec.
- Skipping the release checklist.
- Producing a vague prompt ("build this screen") with no embedded spec.

## Pass criteria
- All five Cursor prompt sections present (Context / Goal / Spec / Tokens / Acceptance criteria).
- At least 6 acceptance criteria items.
- Release checklist explicitly referenced.
- Out-of-scope section present.
`,
  },
  {
    fileName: "S004-figma-mcp-blocked.md",
    content: `# S004 — Figma MCP blocked

## Purpose
Verify the skill falls back to the manual Figma instruction template when Figma MCP is unavailable, instead of stalling.

## Input prompt
> "Figma MCP is blocked in our company. How do we prototype the Rent Split screen?"

## Expected behavior
- Route into \`prototype-planning\` (via \`hook-figma-mcp-blocked\`).
- Open \`templates/figma-instruction-template.md\`.
- Fill prerequisites (Figma URL, page name, frame naming, library status, screen spec link).
- Produce step-by-step manual build instructions covering page / frames / grid / library components / tokens / states / spec export.
- Include the parity checklist.

## Forbidden
- "Just install Figma MCP" advice (the user already said it's blocked).
- Detaching library components without logging it.
- Hardcoding hex / px values without flagging missing tokens.

## Pass criteria
- Manual template selected (not MCP path).
- All prerequisite fields filled.
- All six build steps populated.
- Parity checklist present.
- Open issues table exists (even if empty).
`,
  },
  {
    fileName: "S005-ambiguous-request.md",
    content: `# S005 — Ambiguous request

## Purpose
Verify the skill asks a clarifying question instead of guessing when the request is ambiguous.

## Input prompt
> "Make it better."
> (No screen, no context, no goal attached.)

## Expected behavior
- Identify that required inputs are missing.
- ASK the user for: the screen / artifact in question, the primary user, the primary action, the success metric.
- Do not advance to any design or review work.
- Optionally suggest the most likely route (review-validation? ui-design-foundation?) and ask the user to confirm.

## Forbidden
- Guessing a screen and producing speculative findings.
- Producing a generic "best practices" response with no anchor.
- Picking a stage without telling the user which one and why.
- Producing a UX brief without input.

## Pass criteria
- Response is a question (or a short list of questions).
- Question names the specific missing inputs.
- No premature design or review output.
- Suggested route is named if the skill proposes one.
`,
  },
  {
    fileName: "S006-custom-skill-combination.md",
    content: `# S006 — Custom skill combination

## Purpose
Verify a custom-mode kit (e.g. reference-skill + template-skill only — no test-skill, no workflow) behaves consistently with its declared package types.

## Input prompt
> "Design the Settings screen."
> Kit configured in Custom Mode with includedSkillTypes = [reference-skill, template-skill] only.

## Expected behavior
- Use \`templates/screen-spec-template.md\` and the references the kit ships.
- Produce a screen spec following the template's contract.
- Do not invoke validation flow (no checklists, no tests) since test-skill is not included.
- Do not reference WORK_UNIT.json or HOOKS.json since this kit doesn't ship them.

## Forbidden
- Referencing files not present in the kit (e.g. \`checklists/...\` when the kit has no checklists/).
- Routing to a stage that doesn't exist in this kit.
- Pretending workflow stages exist when this is not a full-step kit.

## Pass criteria
- Output respects the kit's actual file inventory.
- Screen spec is complete per the template's exit criteria.
- No phantom file references.
- No validation gate invoked.
`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Expected outputs — tests/expected/
// ─────────────────────────────────────────────────────────────────────────────

const EXPECTED: { fileName: string; content: string }[] = [
  {
    fileName: "S001-fresh-product-idea.md",
    content: `# S001 — Expected output

## Expected route
\`hook-intake\` → stage \`requirement-intake\`

## Required outputs
- UX brief based on \`templates/ux-brief-template.md\` with:
  - **problem**: a one-sentence \`[role] wants to [action] so that [outcome]\` statement.
  - **user**: precise role + context + known state.
  - **trigger**: where the user is coming from.
  - **successCriteria**: at least one observable behavior.
  - **unknowns**: at least one entry with a resolution.

## Forbidden behavior
- Verbatim restatement of the prompt.
- "User" / "customer" as the only user descriptor.
- Empty unknowns when the input is short.
- Producing a screen design before the brief.

## Pass criteria (binary)
- [ ] Primary user is precise.
- [ ] Primary action is a verb.
- [ ] Success metric is observable.
- [ ] Unknowns list is non-empty OR justified.
- [ ] No design artifacts produced yet.

## Sample correct answer (sketch)
\`\`\`json
{
  "problem": "Roommate wants to split this month's rent so that everyone pays a fair share without manual math.",
  "user": { "role": "Roommate", "context": "shares an apartment with 2-4 others", "knownState": "knows total rent + each room" },
  "trigger": "Rent due date approaches",
  "successCriteria": [
    "Every roommate sees their amount within 30 seconds of opening the app"
  ],
  "unknowns": [
    { "question": "How are utilities handled?", "resolution": "defer", "default": "out of scope for v1" }
  ]
}
\`\`\`
`,
  },
  {
    fileName: "S002-existing-screen-review.md",
    content: `# S002 — Expected output

## Expected route
\`hook-review\` → stage \`review-validation\`

## Required outputs
- Filled \`templates/design-review-template.md\` audit grid for: primary-action, hierarchy, states, accessibility, consistency, microcopy.
- At least one \`finding\` row with: \`category\`, \`severity\`, \`observation\`, \`impact\`, \`fix\`, \`effort\`.
- A \`prioritized\` list of finding IDs.

## Forbidden behavior
- Taste-only comments.
- Findings without an actionable \`fix\`.
- Skipping the accessibility audit.
- Marking everything as blocker.

## Pass criteria
- [ ] Every audit row has pass / warn / fail.
- [ ] Every finding has an owner and a fix.
- [ ] Accessibility audit reports contrast + keyboard reachability.
- [ ] Prioritization is severity-sorted, then impact ÷ effort.
`,
  },
  {
    fileName: "S003-cursor-handoff.md",
    content: `# S003 — Expected output

## Expected route
\`hook-handoff\` → stage \`handoff\`

## Required outputs
- Filled \`templates/cursor-prompt-template.md\` with: Context / Goal / Spec / Tokens / Acceptance criteria / Output / Out of scope / Handoff checklist.
- A reference to \`checklists/release-checklist.md\` confirming it is fully ticked.
- A reference to the relevant \`screen-spec-<ScreenName>.md\`.

## Forbidden behavior
- Shipping without acceptance criteria.
- Inventing tokens or component names.
- Skipping the release checklist.
- Generic "build this screen" prompts.

## Pass criteria
- [ ] All five Cursor prompt sections populated.
- [ ] ≥ 6 acceptance-criteria items.
- [ ] Release checklist explicitly referenced.
- [ ] Out-of-scope section present.
- [ ] Telemetry events listed if the spec listed any.
`,
  },
  {
    fileName: "S004-figma-mcp-blocked.md",
    content: `# S004 — Expected output

## Expected route
\`hook-figma-mcp-blocked\` → stage \`prototype-planning\` (path = \`manual\`)

## Required outputs
- \`templates/figma-instruction-template.md\` selected.
- Prerequisites populated: Figma URL, target page, frame naming, library status, screen spec link.
- All six manual build steps written: page → frames → grids → library components → tokens → states → spec export.
- Parity checklist present.

## Forbidden behavior
- Recommending the user "just install Figma MCP".
- Skipping prerequisites.
- Detaching library components without logging.
- Hardcoded hex / px without flagging missing tokens.

## Pass criteria
- [ ] Manual path declared.
- [ ] Every prerequisite has a value (or explicit "TBD" with owner).
- [ ] All six build steps populated.
- [ ] Parity checklist present and matches the screen spec's required items.
`,
  },
  {
    fileName: "S005-ambiguous-request.md",
    content: `# S005 — Expected output

## Expected route
\`stage: requirement-intake\` (asking) OR no stage advance yet.

## Required outputs
- A clarifying question (or short numbered list of questions).
- The questions must name the specific missing inputs (artifact, user, action, metric).
- Optional: a proposed route the skill thinks is most likely, with confirmation request.

## Forbidden behavior
- Producing speculative design output.
- Producing generic best-practice copy with no anchor.
- Silently picking a stage without telling the user.
- Producing a UX brief without input.

## Pass criteria
- [ ] Response is a question / questions.
- [ ] Missing inputs are explicitly named.
- [ ] No premature design or review output.
- [ ] If a route is proposed, it is named and confirmation is requested.
`,
  },
  {
    fileName: "S006-custom-skill-combination.md",
    content: `# S006 — Expected output

## Expected route
For \`includedSkillTypes = [reference-skill, template-skill]\`:
- No workflow stage (this kit has no \`WORK_UNIT.json\` / \`HOOKS.json\`).
- Direct use of \`templates/screen-spec-template.md\` grounded in the kit's references.

## Required outputs
- Screen spec following the template's contract (purpose, primary action, hierarchy, components, all four states, responsive notes, tokens).

## Forbidden behavior
- Referencing files the kit does not ship (e.g. \`checklists/*\`, \`tests/*\`, \`WORK_UNIT.json\`, \`HOOKS.json\`).
- Pretending workflow stages exist.
- Invoking validation gates that this kit does not ship.

## Pass criteria
- [ ] Output paths exist in the kit.
- [ ] Screen spec meets the template's exit criteria.
- [ ] No phantom file references.
- [ ] No validation gate invoked.
`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scorecards — tests/scorecards/
// ─────────────────────────────────────────────────────────────────────────────

const SCORECARDS: { fileName: string; content: string }[] = [
  {
    fileName: "routing-scorecard.md",
    content: `# Routing Scorecard

Score how well the skill routes incoming requests to the correct stage / hook.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Did the skill identify the correct stage? | wrong stage | partial / hesitant | correct |
| Did the skill name the hook by id? | no | implicit | yes |
| Did the skill respect \`requiresContext\` of the hook? | ignored | partial | yes |
| Did the skill respect \`skipIf\` conditions? | ignored | partial | yes |
| Did the skill produce a fallback if routing was uncertain? | no | partial | yes |

Max points per question: **2**. Scale to the 20-point \`Routing Accuracy\` slice in the overall rubric: \`points / 10 * 20\`.
`,
  },
  {
    fileName: "output-contract-scorecard.md",
    content: `# Output Contract Scorecard

Score how strictly the skill respected the template's declared output contract.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Are all required sections present? | missing several | one missing | complete |
| Are field types correct (verb vs noun, observable vs feeling)? | many wrong | a few wrong | correct |
| Are all required states / branches covered (e.g. 4-tuple states)? | missing several | one missing | complete |
| Are tokens used instead of raw values? | raw values | mixed | tokens only |
| Are accessibility minimums met? | not addressed | partial | addressed |

Max points: **10**. Scale to the 25-point \`Output Contract\` slice: \`points / 10 * 25\`.
`,
  },
  {
    fileName: "handoff-readiness-scorecard.md",
    content: `# Handoff Readiness Scorecard

Score whether the engineer (or downstream agent) can act on the output without re-asking.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Are acceptance criteria concrete and observable? | no | partial | yes |
| Is the screen spec attached or referenced by path? | no | partial | yes |
| Are tokens / theme references included? | no | partial | yes |
| Is out-of-scope explicit? | no | implicit | explicit |
| Is the release checklist ticked? | no | partial | yes |

Max points: **10**. Scale to the 20-point \`Practicality\` slice: \`points / 10 * 20\`.
`,
  },
  {
    fileName: "practical-quality-scorecard.md",
    content: `# Practical Quality Scorecard

Score the practical quality of the response beyond contract compliance.

| Question | 0 | 1 | 2 |
|---|---|---|---|
| Did the skill ask for missing inputs instead of guessing? | guessed | partial | asked |
| Did the skill stay concise where appropriate? | too long | mixed | concise |
| Did the skill avoid taste-only commentary? | taste-heavy | a little | actionable only |
| Did the skill mention the validation gate / log? | no | implicit | explicit |
| Did the skill respect what the kit does NOT ship? | referenced phantom files | mixed | only real files |

Max points: **10**. Splits into: \`Practicality\` (10), \`Validation Readiness\` (10), \`Conciseness / Control\` (10) — see the rubric in the Validation Lab.
`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────────────────────

export function buildTestFiles(): TestFileSpec[] {
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
  for (const s of SCENARIOS) {
    out.push({
      fileName: s.fileName,
      subPath: "scenarios",
      content: s.content,
      generatedFrom: [`scenario-${s.fileName.replace(/\.[^.]+$/, "")}`],
    });
  }
  for (const e of EXPECTED) {
    out.push({
      fileName: e.fileName,
      subPath: "expected",
      content: e.content,
      generatedFrom: [`expected-${e.fileName.replace(/\.[^.]+$/, "")}`],
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

/**
 * Scenario manifest — used by the in-app Validation Lab so it can show
 * each scenario's expected route, required outputs, and pass criteria
 * without re-parsing the markdown files.
 */
export type ScenarioManifestEntry = {
  id: string;
  fileName: string;
  title: string;
  inputPrompt: string;
  expectedRoute: string;
  requiredOutputs: string[];
  forbidden: string[];
  passCriteria: string[];
};

export const SCENARIO_MANIFEST: ScenarioManifestEntry[] = [
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
  },
  {
    id: "S004",
    fileName: "S004-figma-mcp-blocked.md",
    title: "Figma MCP blocked",
    inputPrompt:
      '"Figma MCP is blocked in our company. How do we prototype the Rent Split screen?"',
    expectedRoute:
      "hook-figma-mcp-blocked → prototype-planning (path = manual)",
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
      "Optional: proposed route with confirmation request",
    ],
    forbidden: [
      "Speculative design output",
      "Generic best-practice copy with no anchor",
      "Silently picking a stage",
      "UX brief without input",
    ],
    passCriteria: [
      "Response is a question / questions",
      "Missing inputs are explicitly named",
      "No premature design or review output",
      "If a route is proposed, it is named",
    ],
  },
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
  },
];

export const SCORE_RUBRIC = [
  { key: "routing", label: "Routing Accuracy", max: 20 },
  { key: "references", label: "Reference Usage", max: 15 },
  { key: "outputContract", label: "Output Contract", max: 25 },
  { key: "practicality", label: "Practicality", max: 20 },
  { key: "validationReadiness", label: "Validation Readiness", max: 10 },
  { key: "conciseness", label: "Conciseness / Control", max: 10 },
] as const;

export type ScoreKey = (typeof SCORE_RUBRIC)[number]["key"];
