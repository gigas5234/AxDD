export type StageGuideFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

type GuideShape = {
  fileName: string;
  title: string;
  purpose: string;
  whenToUse: string[];
  requiredInputs: string[];
  optionalInputs: string[];
  procedure: string[];
  decisionRules: string[];
  outputContract: string;
  qualityGate: string[];
  failureHandling: string[];
  exampleInput: string;
  exampleOutput: string;
  handoff: string;
};

function render(g: GuideShape): string {
  const out: string[] = [];
  out.push(`# ${g.title} — Stage Guide`, "");
  out.push("## Purpose");
  out.push(g.purpose, "");
  out.push("## When to use");
  for (const l of g.whenToUse) out.push(`- ${l}`);
  out.push("");
  out.push("## Required inputs");
  for (const l of g.requiredInputs) out.push(`- ${l}`);
  out.push("");
  out.push("## Optional inputs");
  for (const l of g.optionalInputs.length ? g.optionalInputs : ["—"]) out.push(`- ${l}`);
  out.push("");
  out.push("## Procedure");
  g.procedure.forEach((step, i) => out.push(`${i + 1}. ${step}`));
  out.push("");
  out.push("## Decision rules");
  for (const l of g.decisionRules) out.push(`- ${l}`);
  out.push("");
  out.push("## Output contract");
  out.push("```");
  out.push(g.outputContract);
  out.push("```", "");
  out.push("## Quality gate");
  for (const l of g.qualityGate) out.push(`- [ ] ${l}`);
  out.push("");
  out.push("## Failure handling");
  for (const l of g.failureHandling) out.push(`- ${l}`);
  out.push("");
  out.push("## Example input");
  out.push("> " + g.exampleInput, "");
  out.push("## Example output");
  out.push("```");
  out.push(g.exampleOutput);
  out.push("```", "");
  out.push("## Handoff to next stage");
  out.push(g.handoff, "");
  return out.join("\n");
}

const GUIDES: GuideShape[] = [
  {
    fileName: "requirement-intake-guide.md",
    title: "Requirement Intake",
    purpose:
      "Turn a rough product idea into a precise brief naming the primary user, the primary action, and the success metric. No design work happens here.",
    whenToUse: [
      "A user describes a product, feature, or screen in a paragraph or less.",
      "The user provides a goal without any existing screens.",
      "A prior stage flagged a structural problem requiring a re-brief.",
    ],
    requiredInputs: [
      "One sentence describing what the user wants.",
      "Primary user role.",
      "Observable success state.",
    ],
    optionalInputs: [
      "Stakeholder notes",
      "Constraints (budget, timeline, regulation)",
      "Existing screenshots or competitor links",
    ],
    procedure: [
      "Restate the request in the form `[role] wants to [action] so that [outcome]`. If it doesn't fit one sentence, the problem is more than one problem — split it.",
      "Name the primary user precisely. `\"Customer\"` is too vague. `\"First-time customer landing from a marketing email\"` is precise.",
      "Map the trigger — where did the user come from? What just happened?",
      "List unknowns. For each: ask, default, or defer.",
      "Define success as observable behavior, not feelings.",
    ],
    decisionRules: [
      "If you cannot fit the request into the `[role] wants to [action] so that [outcome]` sentence, STOP and split.",
      "If `successCriteria` contains a feeling rather than a behavior, rewrite it.",
      "If the request is shorter than 3 sentences AND `unknowns` is empty, you missed assumptions — re-audit.",
    ],
    outputContract: `{
  "problem": "[role] wants to [action] so that [outcome].",
  "user": { "role": "...", "context": "...", "knownState": "..." },
  "trigger": "...",
  "successCriteria": ["observable behavior 1", "observable behavior 2"],
  "unknowns": [
    { "question": "...", "resolution": "ask" | "default" | "defer", "default": "..." }
  ]
}`,
    qualityGate: [
      "Primary user is named and precise.",
      "Primary action is a verb, not a noun.",
      "Success metric is observable.",
      "All unknowns have a resolution.",
    ],
    failureHandling: [
      "Missing required input → ASK the user; do not invent.",
      "Brief fails the quality gate → record the failure in `tests/validation-log-template.md` and re-run this stage.",
      "Stakeholders disagree → log both positions in `unknowns` with `resolution: \"defer\"` and proceed only on the agreed parts.",
    ],
    exampleInput:
      "We want an app that helps roommates split rent fairly each month.",
    exampleOutput: `{
  "problem": "Roommate wants to split this month's rent so that everyone pays their fair share without manual math.",
  "user": { "role": "Roommate", "context": "shares an apartment with 2-4 others", "knownState": "knows total rent and each room" },
  "trigger": "Rent due date approaches",
  "successCriteria": [
    "Every roommate sees their amount within 30 seconds of opening the app",
    "No one has to do math on paper"
  ],
  "unknowns": [
    { "question": "How are utilities handled?", "resolution": "defer", "default": "out of scope for v1" }
  ]
}`,
    handoff:
      "Pass the brief to **UX Foundation**. Attach it to `templates/ux-brief-template.md` and tick the corresponding items in `checklists/ux-foundation-checklist.md`.",
  },
  {
    fileName: "ux-foundation-guide.md",
    title: "UX Foundation",
    purpose:
      "Translate the brief into a user flow, an information architecture, and a screen inventory. Establish what screens exist and what each one is for, before any visual design.",
    whenToUse: [
      "Requirement Intake exit criteria are met.",
      "A new flow must be added to an existing kit.",
      "The current IA is being audited for gaps.",
    ],
    requiredInputs: ["UX brief from Requirement Intake."],
    optionalInputs: [
      "Existing flows from prior versions",
      "Analytics on existing drop-off points",
    ],
    procedure: [
      "List the happy-path steps from entry to success.",
      "Mark every decision point with explicit branches.",
      "Annotate failure and empty states along the path.",
      "Enumerate every screen the flow touches.",
      "Define the navigation model (tabs, stack, modal).",
      "For each screen, name its one-sentence purpose and primary action.",
    ],
    decisionRules: [
      "Each screen has exactly one primary action. If two compete, demote one or split the screen.",
      "Every alternate branch must terminate (success, retry, or exit).",
      "If a screen has no primary action, it does not belong in the flow — fold it into a sibling.",
    ],
    outputContract: `{
  "flow": [
    { "step": "...", "screen": "...", "branches": [{ "condition": "...", "to": "..." }] }
  ],
  "screens": [
    { "name": "...", "purpose": "...", "primaryAction": "...", "entry": "...", "exit": "..." }
  ],
  "navigation": "tabs" | "stack" | "modal" | "mixed"
}`,
    qualityGate: [
      "Every screen lists a purpose and a primary action.",
      "Every decision point has at least one alternate branch.",
      "Every alternate branch terminates.",
      "Navigation model is named and consistent across screens.",
    ],
    failureHandling: [
      "Two screens fight for the same primary action → merge them or split the action.",
      "An alternate branch with no terminus → mark it `defer` and log it in the validation log.",
      "Brief is too vague to define a flow → return to Requirement Intake.",
    ],
    exampleInput:
      "Rent-split brief: roommate wants per-person amount in under 30 seconds.",
    exampleOutput: `{
  "flow": [
    { "step": "open app", "screen": "Home", "branches": [] },
    { "step": "tap 'New month'", "screen": "EntryScreen", "branches": [
      { "condition": "rent unchanged", "to": "ResultScreen" },
      { "condition": "rent changed", "to": "EditRentScreen" }
    ]}
  ],
  "screens": [
    { "name": "Home", "purpose": "Show this month's split at a glance", "primaryAction": "Open this month", "entry": "app launch", "exit": "EntryScreen" },
    { "name": "EntryScreen", "purpose": "Confirm rent and roommates", "primaryAction": "Calculate", "entry": "Home", "exit": "ResultScreen" },
    { "name": "ResultScreen", "purpose": "Show per-person amount", "primaryAction": "Copy amount", "entry": "EntryScreen", "exit": "Home" }
  ],
  "navigation": "stack"
}`,
    handoff:
      "Pass the screen inventory to **UI Design Foundation**. Tick `checklists/ux-foundation-checklist.md`.",
  },
  {
    fileName: "ui-design-foundation-guide.md",
    title: "UI Design Foundation",
    purpose:
      "Produce a screen specification for every screen in the inventory. Each spec covers hierarchy, components, states, responsive behavior, and tokens.",
    whenToUse: [
      "UX Foundation exit criteria are met.",
      "A new screen must be added to an existing flow.",
      "An existing screen needs its states fleshed out.",
    ],
    requiredInputs: [
      "Screen inventory from UX Foundation.",
      "Screen name, purpose, primary action, entry, and exit per screen.",
    ],
    optionalInputs: [
      "Existing design system (tokens, primitives)",
      "Brand direction notes",
    ],
    procedure: [
      "For each screen, open `templates/screen-spec-template.md`.",
      "Name the primary action first; do not list UI elements until it is named.",
      "Rank content priority (information hierarchy) by reading order.",
      "Decompose the screen into reusable, named components.",
      "Specify all four states: default / empty / loading / error.",
      "Add responsive notes for mobile / tablet / desktop.",
      "Reference tokens for color / type / spacing / radius; never raw values.",
    ],
    decisionRules: [
      "If the primary action is unclear, list candidates and ASK the user to pick.",
      "If empty state has no `nextStep`, the empty state is broken — fix it.",
      "If error state cannot be described in one sentence, the failure mode is not understood.",
      "If `hierarchy` exceeds 5 items, the screen is overloaded — split it.",
      "If a responsive variant says `\"same as desktop\"`, that is not a design decision.",
    ],
    outputContract: `{
  "screen": "ScreenName",
  "purpose": "one sentence",
  "primaryAction": { "label": "...", "destination": "..." },
  "hierarchy": ["most important", "second", "third"],
  "components": [
    { "name": "ComponentName", "purpose": "...", "variants": ["..."], "states": ["..."] }
  ],
  "states": {
    "default": "...",
    "empty": { "trigger": "...", "design": "...", "nextStep": "..." },
    "loading": "skeleton shape",
    "error": { "trigger": "...", "design": "...", "recovery": "..." }
  },
  "responsive": { "mobile": "...", "tablet": "...", "desktop": "..." }
}`,
    qualityGate: [
      "Every screen has all 4 states (default / empty / loading / error).",
      "Empty state has a defined next step.",
      "Error state has a defined recovery path.",
      "Tokens are used for color / type / spacing / radius.",
      "Responsive notes exist for every breakpoint.",
    ],
    failureHandling: [
      "Spec fails the quality gate → record in `tests/validation-log-template.md` and re-run the failing screen.",
      "Token missing for a needed value → log in **Open Issues** of the figma instruction template and propose a token name.",
      "Component appears once and only once across all screens → keep it for now but flag for review in the next stage.",
    ],
    exampleInput:
      "Screen inventory includes EntryScreen with primary action 'Calculate'.",
    exampleOutput: `{
  "screen": "EntryScreen",
  "purpose": "Confirm rent and roommates before calculating the split.",
  "primaryAction": { "label": "Calculate", "destination": "ResultScreen" },
  "hierarchy": ["rent total", "roommate list", "calculate CTA"],
  "components": [
    { "name": "RentField", "purpose": "edit total rent", "variants": ["default"], "states": ["default","focus","error"] },
    { "name": "RoommateRow", "purpose": "edit name + share", "variants": ["default","removable"], "states": ["default","focus"] },
    { "name": "PrimaryCTA", "purpose": "submit form", "variants": ["primary"], "states": ["default","disabled","loading"] }
  ],
  "states": {
    "default": "Rent total + 3 roommate rows + CTA.",
    "empty": { "trigger": "no roommates yet", "design": "Show a single empty roommate row with an Add button.", "nextStep": "Tap Add to insert a row." },
    "loading": "CTA shows a spinner; fields lock.",
    "error": { "trigger": "rent is not a number", "design": "Inline error under RentField.", "recovery": "User edits the value to a number." }
  },
  "responsive": {
    "mobile": "single column, CTA sticky bottom",
    "tablet": "single column, CTA inline",
    "desktop": "two columns: form left, summary right"
  }
}`,
    handoff:
      "Pass screen specs to **Prototype Planning**. Tick `checklists/ui-design-checklist.md`.",
  },
  {
    fileName: "prototype-planning-guide.md",
    title: "Prototype Planning",
    purpose:
      "Plan how the screens will be prototyped. Prefer Figma MCP. If MCP is blocked, produce manual Figma instructions a designer can follow.",
    whenToUse: [
      "UI Design Foundation exit criteria are met for at least one screen.",
      "An existing prototype needs to be rebuilt or extended.",
      "Figma MCP is unavailable and a manual fallback is needed.",
    ],
    requiredInputs: [
      "Screen specifications.",
      "Component breakdown.",
      "Token references (or names if tokens do not yet exist).",
    ],
    optionalInputs: ["Figma file URL and target page name."],
    procedure: [
      "Determine whether Figma MCP is available. If yes, use it.",
      "If MCP is blocked, open `templates/figma-instruction-template.md` and fill in: Figma URL, target page, frame naming convention, library status, screen spec link.",
      "List the build steps: pages → frames → grids → library components → tokens → states → spec export.",
      "Name each frame per breakpoint (mobile / tablet / desktop).",
      "Decide which screens are in scope for this prototype iteration.",
    ],
    decisionRules: [
      "If Figma MCP is blocked, fall back to the manual instruction template — do not assume MCP will be unblocked.",
      "Do not detach library components unless absolutely required; log every detachment.",
      "Do not hardcode hex / px values; if a token is missing, log it in **Open Issues**.",
    ],
    outputContract: `{
  "path": "mcp" | "manual",
  "screens": ["ScreenName", ...],
  "frames": [{ "screen": "...", "breakpoint": "mobile|tablet|desktop", "name": "Screen / X / default" }],
  "openIssues": [{ "issue": "...", "blocker": true | false, "owner": "..." }]
}`,
    qualityGate: [
      "Path is named (mcp or manual).",
      "Every screen in scope has a frame per required breakpoint.",
      "All open issues have an owner.",
      "Manual path attaches `templates/figma-instruction-template.md` with all prerequisites filled in.",
    ],
    failureHandling: [
      "MCP intermittently fails → switch to manual path; do not stall waiting for MCP.",
      "Library is missing a component → log in Open Issues and propose a component name in Design System notes.",
      "Spec changes mid-build → mark the affected frame as stale and re-run the screen through UI Design Foundation.",
    ],
    exampleInput:
      "Three screen specs ready; corporate Figma MCP server is blocked.",
    exampleOutput: `{
  "path": "manual",
  "screens": ["Home", "EntryScreen", "ResultScreen"],
  "frames": [
    { "screen": "Home", "breakpoint": "mobile", "name": "Screen / Home / default" },
    { "screen": "EntryScreen", "breakpoint": "mobile", "name": "Screen / EntryScreen / default" },
    { "screen": "EntryScreen", "breakpoint": "mobile", "name": "Screen / EntryScreen / error" },
    { "screen": "ResultScreen", "breakpoint": "mobile", "name": "Screen / ResultScreen / default" }
  ],
  "openIssues": [
    { "issue": "Token 'color.surface.warning' missing from library", "blocker": false, "owner": "@design-system" }
  ]
}`,
    handoff:
      "Pass the prototype plan and the built frames to **Review & Validation**.",
  },
  {
    fileName: "review-validation-guide.md",
    title: "Review & Validation",
    purpose:
      "Audit the screens and the prototype for UX issues, accessibility issues, and consistency issues. Run sandbox scenarios. Decide ship / hold.",
    whenToUse: [
      "Prototype Planning has produced at least one buildable frame.",
      "An existing kit must be re-validated after a change.",
      "Pre-release gate before Handoff.",
    ],
    requiredInputs: [
      "Screen specifications.",
      "Built prototype frames (MCP or manual).",
      "`tests/sandbox-test-scenario.md` populated with current scenarios.",
    ],
    optionalInputs: [
      "Prior validation log entries",
      "User research notes",
    ],
    procedure: [
      "Run the **primary action audit** for every screen. Can a first-time user find the primary action in under 3 seconds?",
      "Run the **hierarchy audit**. Does visual weight match information rank?",
      "Run the **states audit**. Are all 4 states present and correct?",
      "Run the **accessibility audit**. AA contrast, keyboard reachability, touch targets.",
      "Run the **consistency audit**. Same intent, same expression.",
      "Run the **microcopy audit**. Verbs, concrete labels, helpful error messages.",
      "Execute every scenario in `tests/sandbox-test-scenario.md` and log each result in `tests/validation-log-template.md`.",
    ],
    decisionRules: [
      "If the primary action audit fails, it is the top finding. Stop the rest of the audit until it is resolved or accepted.",
      "Severity sort: blocker > major > minor.",
      "If any finding has no actionable fix, you do not yet understand the problem — restate it.",
      "If any scenario fails AND there is no accepted exception, the kit does not pass the gate.",
    ],
    outputContract: `{
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
  "prioritized": ["F-01", "F-02"],
  "scenarioResults": [{ "scenarioId": "S-001", "result": "pass" | "warn" | "fail", "notes": "..." }]
}`,
    qualityGate: [
      "Every screen passed the primary action audit (or has an accepted exception).",
      "All sandbox scenarios pass or are accepted.",
      "Accessibility audit complete; AA contrast met.",
      "Every finding has an owner.",
    ],
    failureHandling: [
      "Blocker finding → fix or accept with reason in the validation log before advancing.",
      "Scenario fail → log in `tests/validation-log-template.md`; either fix the kit or add an Accepted Exception with reviewer signature.",
      "Audit reveals systemic problem → return to UI Design Foundation or UX Foundation depending on the root cause.",
    ],
    exampleInput:
      "Three built frames + sandbox scenarios S-001..S-004.",
    exampleOutput: `{
  "summary": "Ship-ready with one accepted exception.",
  "findings": [
    { "id": "F-01", "category": "states", "severity": "major", "observation": "ResultScreen lacks a loading state", "impact": "Users see a blank screen during calculation", "fix": "Add skeleton + spinner; lock CTA", "effort": "S" },
    { "id": "F-02", "category": "accessibility", "severity": "minor", "observation": "Inline error text is 13px gray on white", "impact": "Sub-AA contrast at 3.8:1", "fix": "Use color.ink.error token (5.2:1)", "effort": "S" }
  ],
  "prioritized": ["F-01", "F-02"],
  "scenarioResults": [
    { "scenarioId": "S-001", "result": "pass", "notes": "" },
    { "scenarioId": "S-002", "result": "warn", "notes": "loading state missing — see F-01" },
    { "scenarioId": "S-003", "result": "pass", "notes": "manual fallback used correctly" },
    { "scenarioId": "S-004", "result": "pass", "notes": "" }
  ]
}`,
    handoff:
      "If gate passes, advance to **Handoff**. Otherwise, return to the failing prior stage and re-validate.",
  },
  {
    fileName: "handoff-guide.md",
    title: "Handoff",
    purpose:
      "Produce implementation-ready artifacts and release the kit's output to engineering. Confirm the release checklist before shipping.",
    whenToUse: [
      "Review & Validation gate passed.",
      "An interim version is being handed to engineering for parallel work.",
      "A re-release after a fix.",
    ],
    requiredInputs: [
      "Screen specifications.",
      "Validation log showing no unresolved blockers.",
      "Tokens / theme references.",
    ],
    optionalInputs: [
      "Existing implementation prompt from a prior release",
      "Engineering's preferred framework if not React + Tailwind",
    ],
    procedure: [
      "For each screen, fill `templates/cursor-prompt-template.md` with: product / screen / framework / design system / spec / tokens / acceptance criteria.",
      "Attach screen specs and validation log to the handoff package.",
      "Tick `checklists/handoff-checklist.md`.",
      "Tick `checklists/release-checklist.md`.",
      "Bump version in `SKILL.md` frontmatter.",
      "Hand off to engineering.",
    ],
    decisionRules: [
      "Do not ship if any item in `release-checklist.md` is unchecked.",
      "Do not ship if the validation log shows an unresolved blocker without an accepted exception.",
      "Do not ship without a versioned `SKILL.md`.",
    ],
    outputContract: `{
  "implementationPrompts": ["path/to/cursor-prompt-<Screen>.md", ...],
  "attachedSpecs": ["path/to/screen-spec-<Screen>.md", ...],
  "validationLogRef": "tests/validation-log-template.md#run-YYYY-MM-DD",
  "version": "0.1.1",
  "owner": "<name>",
  "escalation": "<escalation path>"
}`,
    qualityGate: [
      "Release checklist fully ticked.",
      "Handoff checklist fully ticked.",
      "Validation log shows no unresolved blockers.",
      "Version bumped in SKILL.md frontmatter.",
      "Owner and escalation path documented.",
    ],
    failureHandling: [
      "Release checklist fails → fix the missing items; do not bypass.",
      "Engineering reports the prompt is ambiguous → return to UI Design Foundation for the affected screen and re-validate.",
      "Release rolled back → re-open Review & Validation with the post-release findings.",
    ],
    exampleInput: "Validation gate passed; three screens ready.",
    exampleOutput: `{
  "implementationPrompts": [
    "handoff/cursor-prompt-Home.md",
    "handoff/cursor-prompt-EntryScreen.md",
    "handoff/cursor-prompt-ResultScreen.md"
  ],
  "attachedSpecs": [
    "handoff/screen-spec-Home.md",
    "handoff/screen-spec-EntryScreen.md",
    "handoff/screen-spec-ResultScreen.md"
  ],
  "validationLogRef": "tests/validation-log-template.md#run-2026-05-24",
  "version": "0.1.1",
  "owner": "@kit-owner",
  "escalation": "#design-eng on-call"
}`,
    handoff:
      "Stage chain complete. After ship, capture any post-release findings back into `tests/validation-log-template.md` and re-enter at the appropriate prior stage.",
  },
];

export function buildStageGuideFiles(): StageGuideFileSpec[] {
  return GUIDES.map((g) => ({
    fileName: g.fileName,
    content: render(g),
    generatedFrom: [`stage-guide-${g.fileName.replace(/\.[^.]+$/, "")}`],
  }));
}
