export type TemplateFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const UX_BRIEF = `# UX Brief Template

> Produced during **Requirement Intake**. The output of this template is the input to **UX Foundation**.

## 0. Meta

- Brief ID: \`<brief-id>\`
- Author: \`<name>\`
- Date: \`<YYYY-MM-DD>\`
- Source request (verbatim, 1–3 sentences):
  > <paste here>

## 1. Problem

- Restate as a single sentence:
  \`[Role] wants to [action] so that [outcome].\`
- Trigger / context (where is the user coming from?):
- Known state (what does the user already know or have?):

## 2. Primary user

- Who (precise — not "the customer"):
- Their goal in this moment:
- Constraints they bring (time, device, environment):
- What they explicitly do not need from us:

## 3. Success criteria

State each as an **observable behavior**, not a feeling.

| # | Observable behavior | Why this matters | How we'd measure |
|---|---------------------|------------------|------------------|
| 1 |                     |                  |                  |
| 2 |                     |                  |                  |

## 4. Scope

- In scope (must ship):
- Out of scope (explicitly excluded for this version):
- Deferred (revisit later, with reason):

## 5. Constraints

- Technical (stack, integrations, deadlines):
- Business (budget, brand, legal):
- Accessibility / compliance (AA, region-specific):

## 6. Unknowns

| # | Question | Resolution | Default if defaulted | Owner |
|---|----------|-----------|----------------------|-------|
| 1 |          | ask / default / defer |                | |
| 2 |          | ask / default / defer |                | |

## 7. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 |      | L/M/H     | L/M/H  |            |

## 8. Output contract (machine-readable echo)

\`\`\`json
{
  "problem": "[role] wants to [action] so that [outcome].",
  "user": { "role": "...", "context": "...", "knownState": "..." },
  "trigger": "...",
  "successCriteria": ["observable behavior 1", "observable behavior 2"],
  "scope": { "in": ["..."], "out": ["..."], "deferred": ["..."] },
  "constraints": { "technical": ["..."], "business": ["..."], "accessibility": ["..."] },
  "unknowns": [
    { "question": "...", "resolution": "ask|default|defer", "default": "..." }
  ],
  "risks": [
    { "risk": "...", "likelihood": "L|M|H", "impact": "L|M|H", "mitigation": "..." }
  ]
}
\`\`\`

## 9. Exit criteria (UX Foundation cannot start until these are true)

- [ ] Primary user is named and precise.
- [ ] Restate sentence fits in one line.
- [ ] At least one observable success criterion.
- [ ] Every unknown has a resolution.
- [ ] Constraints and risks recorded.
`;

const SCREEN_SPEC = `# Screen Specification Template

> Produced during **UI Design Foundation**, one per screen. Consumed by **Prototype Planning** and **Review & Validation**.

## 0. Meta

- Spec ID: \`screen-spec-<ScreenName>\`
- Belongs to flow: \`<flow-id>\`
- Author: \`<name>\`
- Date: \`<YYYY-MM-DD>\`
- Status: draft / reviewed / approved

## 1. Identity

- Screen name: \`<ScreenName>\`
- Purpose (one sentence, no fluff):
- Entry point (where in the flow does the user arrive from?):
- Exit point (where does the primary action lead?):
- Primary user role for this screen:

## 2. Primary action

The single action the user is here to perform.

- Label (verb-led, concrete):
- Destination (next screen or action):
- Disabled when:
- Loading behavior:

## 3. Information hierarchy

Rank by *reading order* and *importance*. Max 5 items.

| Rank | Content | Why it ranks here |
|------|---------|-------------------|
| 1    |         |                   |
| 2    |         |                   |
| 3    |         |                   |

## 4. Components

| Name | Purpose | Variants | States | Tokens used |
|------|---------|----------|--------|-------------|
|      |         |          |        |             |
|      |         |          |        |             |

## 5. States (all four required)

### Default
- Description:

### Empty
- Trigger:
- Design:
- Next step (must exist):

### Loading
- Skeleton shape / spinner placement:
- Locks which controls:

### Error
- Trigger:
- Design:
- Recovery path:

## 6. Responsive

| Breakpoint | Layout | Primary CTA placement | Notes |
|------------|--------|-----------------------|-------|
| Mobile <640 |        |                       |       |
| Tablet 640–1023 |    |                       |       |
| Desktop ≥1024 |      |                       |       |

## 7. Accessibility

- Contrast for body text (≥ AA 4.5:1):
- Contrast for large text / icons (≥ AA 3:1):
- Keyboard reachability and visible focus:
- Touch target minimums (mobile ≥ 44 px, desktop ≥ 32 px):
- Screen reader labels for icon-only controls:

## 8. Implementation notes

- Tokens (color / type / spacing / radius):
- Edge cases:
- Telemetry events to fire:

## 9. Output contract

\`\`\`json
{
  "screen": "ScreenName",
  "purpose": "one sentence",
  "primaryAction": { "label": "...", "destination": "...", "disabledWhen": "...", "loading": "..." },
  "hierarchy": ["most important", "second", "third"],
  "components": [
    { "name": "ComponentName", "purpose": "...", "variants": ["..."], "states": ["..."], "tokens": ["..."] }
  ],
  "states": {
    "default": "...",
    "empty": { "trigger": "...", "design": "...", "nextStep": "..." },
    "loading": "...",
    "error": { "trigger": "...", "design": "...", "recovery": "..." }
  },
  "responsive": { "mobile": "...", "tablet": "...", "desktop": "..." },
  "accessibility": { "contrastBody": "...", "contrastLarge": "...", "keyboard": "...", "touchTargets": "..." }
}
\`\`\`

## 10. Exit criteria

- [ ] Primary action named and concrete.
- [ ] Hierarchy ranked (≤ 5 items).
- [ ] All 4 states specified.
- [ ] Empty state has a next step.
- [ ] Error state has a recovery path.
- [ ] Responsive notes for every breakpoint.
- [ ] Accessibility minimums met.
- [ ] Tokens listed; no raw values in spec.
`;

const CURSOR_PROMPT = `# Cursor-Ready Implementation Prompt

> Produced during **Handoff** from an approved screen specification. One prompt per screen.

## Context

- Product: \`<product>\`
- Screen: \`<ScreenName>\`
- Framework: React + Tailwind (override if different)
- Design system: \`<design-system-name>\` (tokens: \`<import-path>\`)
- Spec source: \`<path/to/screen-spec-<ScreenName>.md>\`
- Validation log entry: \`<path/to/validation-log#run-YYYY-MM-DD>\`

## Goal

Implement \`<ScreenName>\` matching the attached spec. Do not invent behavior the spec does not describe.

## Spec (embedded)

<paste the full screen specification here, or include it by reference>

## Tokens

<paste tokens, or import path; do not let the model pick colors>

## Acceptance criteria

The implementation is accepted only when all of these hold.

- [ ] Primary action is visually dominant and labeled exactly as the spec.
- [ ] All four states are implemented (default / empty / loading / error).
- [ ] Empty state shows the spec's "next step".
- [ ] Error state shows the spec's recovery path.
- [ ] Responsive at mobile (<640), tablet (640–1023), desktop (≥1024).
- [ ] Keyboard reachable; visible focus ring on every interactive element.
- [ ] Touch targets meet ≥ 44 px (mobile) / ≥ 32 px (desktop).
- [ ] AA contrast met for body and large text.
- [ ] All styling uses tokens; no raw hex or arbitrary px outside spec.
- [ ] Telemetry events fire as listed in the spec.

## Output

- A single React component file: \`<ScreenName>.tsx\`.
- Tailwind classes only (no inline style except dynamic values).
- A short "assumptions" block at the end listing anything the spec did not cover and what you assumed.

## Out of scope

- Do not introduce a state machine library.
- Do not refactor adjacent components.
- Do not add analytics events the spec does not list.

## Handoff checklist (engineer ticks)

- [ ] Built and tested at all three breakpoints.
- [ ] Manual accessibility pass (Tab through, screen reader spot-check).
- [ ] Unit tests for visible behavior (not implementation).
- [ ] PR description links back to this prompt and the spec.
`;

const DESIGN_REVIEW = `# Design Review Template

> Produced during **Review & Validation**, one per screen.

## 0. Meta

- Review ID: \`review-<ScreenName>-<YYYY-MM-DD>\`
- Screen reviewed: \`<ScreenName>\`
- Reviewer:
- Source artifacts: \`<spec path>\`, \`<figma frame link>\` (or note manual fallback)

## 1. Summary

One-line verdict: _ship / fix-and-reship / re-design_.

## 2. Audit results

For each audit category, mark **pass / warn / fail** and link the finding IDs from §3.

| Audit              | Result | Findings |
|--------------------|--------|----------|
| Primary action     |        |          |
| Hierarchy          |        |          |
| States (4-tuple)   |        |          |
| Accessibility (AA) |        |          |
| Consistency        |        |          |
| Microcopy          |        |          |

## 3. Findings

For each finding, fill the row. Severity sort: **blocker > major > minor**.

| ID   | Category | Severity | Observation (factual) | Impact (user-visible) | Fix (actionable) | Effort (S/M/L) | Owner |
|------|----------|----------|------------------------|-----------------------|-------------------|---------------|-------|
| F-01 |          |          |                        |                       |                   |               |       |
| F-02 |          |          |                        |                       |                   |               |       |

## 4. Prioritization

List finding IDs in execution order (after severity sort, then by impact ÷ effort).

1.
2.
3.

## 5. Sandbox scenarios

Run every scenario from \`tests/sandbox-test-scenario.md\` and log each here.

| Scenario ID | Result (pass/warn/fail) | Notes | Linked findings |
|-------------|--------------------------|-------|------------------|
| S-001       |                          |       |                  |
| S-002       |                          |       |                  |

## 6. Accepted exceptions

For any \`fail\` or \`warn\` that will not be fixed before release, record the acceptance.

| Finding / Scenario | Reason accepted | Reviewer | Re-review date |
|--------------------|-----------------|----------|----------------|
|                    |                 |          |                |

## 7. Output contract

\`\`\`json
{
  "summary": "one-line verdict",
  "findings": [
    { "id": "F-01", "category": "...", "severity": "blocker|major|minor",
      "observation": "...", "impact": "...", "fix": "...", "effort": "S|M|L", "owner": "..." }
  ],
  "prioritized": ["F-01", "F-02"],
  "scenarioResults": [
    { "scenarioId": "S-001", "result": "pass|warn|fail", "notes": "...", "linkedFindings": ["F-01"] }
  ],
  "acceptedExceptions": [
    { "ref": "F-02|S-002", "reason": "...", "reviewer": "...", "reReviewDate": "YYYY-MM-DD" }
  ]
}
\`\`\`

## 8. Exit criteria

- [ ] Every audit row has a result.
- [ ] Every finding has owner + actionable fix.
- [ ] Every scenario has a result.
- [ ] No unresolved blocker.
- [ ] All accepted exceptions have a reviewer.
`;

export function buildTemplateFiles(opts: {
  includeCursorPrompt: boolean;
}): TemplateFileSpec[] {
  const files: TemplateFileSpec[] = [
    {
      fileName: "ux-brief-template.md",
      content: UX_BRIEF,
      generatedFrom: ["tpl-ux-brief"],
    },
    {
      fileName: "screen-spec-template.md",
      content: SCREEN_SPEC,
      generatedFrom: ["tpl-screen-spec"],
    },
    {
      fileName: "design-review-template.md",
      content: DESIGN_REVIEW,
      generatedFrom: ["tpl-design-review"],
    },
  ];
  if (opts.includeCursorPrompt) {
    files.push({
      fileName: "cursor-prompt-template.md",
      content: CURSOR_PROMPT,
      generatedFrom: ["tpl-cursor-prompt"],
    });
  }
  return files;
}
