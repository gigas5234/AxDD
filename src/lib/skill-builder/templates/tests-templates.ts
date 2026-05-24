export type TestFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const SANDBOX_TEST = `# Sandbox Test Scenario

Repeatable scenarios used to validate this kit's output before release. Run each scenario, record the result in \`tests/validation-log-template.md\`, and gate **Review & Validation** on the outcome.

## How to add a scenario

Copy the block below, give it a unique \`Scenario ID\`, and fill it in.

---

## Scenario S-001 — Fresh product idea routes into Requirement Intake

- **Scenario ID:** S-001
- **Input:**
  > "I want an app that helps people split rent with roommates."
- **Expected stage routing:** \`requirement-intake\` (via \`hook-intake\`)
- **Expected artifacts produced:**
  - UX brief draft from \`templates/ux-brief-template.md\`
- **Pass / fail criteria:**
  - PASS if the brief names primary user, primary action, and success metric.
  - FAIL if any of the three is missing or vague.

## Scenario S-002 — Screen design request routes into UI Design Foundation

- **Scenario ID:** S-002
- **Input:**
  > "Design the rent split entry screen."
- **Expected stage routing:** \`ui-design-foundation\` (via \`hook-screen\`)
- **Expected artifacts produced:**
  - Screen specification from \`templates/screen-spec-template.md\`
- **Pass / fail criteria:**
  - PASS if all 4 states (default / empty / loading / error) are specified.
  - FAIL if any state is missing.

## Scenario S-003 — Figma MCP blocked triggers manual fallback

- **Scenario ID:** S-003
- **Input:**
  > "Figma MCP is blocked in our company. How do we prototype?"
- **Expected stage routing:** \`prototype-planning\` (via \`hook-figma-mcp-blocked\`)
- **Expected artifacts produced:**
  - Manual instructions from \`templates/figma-instruction-template.md\`
- **Pass / fail criteria:**
  - PASS if the response uses the manual template and does not assume MCP is available.
  - FAIL if the response asks the user to "just connect Figma MCP".

## Scenario S-004 — Handoff request triggers release checklist

- **Scenario ID:** S-004
- **Input:**
  > "We're ready to ship. Hand this off to engineering."
- **Expected stage routing:** \`handoff\` (via \`hook-handoff\`)
- **Expected artifacts produced:**
  - Implementation prompt from \`templates/cursor-prompt-template.md\`
  - Release checklist surfaced from \`checklists/release-checklist.md\`
- **Pass / fail criteria:**
  - PASS if the release checklist is presented and the implementation prompt references the screen spec.
  - FAIL if either is missing.
`;

const VALIDATION_LOG = `# Validation Log

Record one row per validation run. Keep history; do not overwrite prior rows.

| Run date   | Kit version | Scenario ID | Result | Notes | Follow-up actions |
|------------|-------------|-------------|--------|-------|-------------------|
| YYYY-MM-DD | 0.1.0       | S-001       | pass   |       |                   |
| YYYY-MM-DD | 0.1.0       | S-002       | warn   |       |                   |
| YYYY-MM-DD | 0.1.0       | S-003       | fail   |       |                   |

## Result legend

- **pass** — all criteria met.
- **warn** — non-blocking deviation; document the reason.
- **fail** — blocking deviation; must be resolved or formally accepted before release.

## Accepted exceptions

List any \`warn\` / \`fail\` rows that have been accepted by the kit owner, with reason and review date.

| Scenario ID | Reason accepted | Reviewer | Re-review date |
|-------------|-----------------|----------|----------------|
|             |                 |          |                |
`;

export function buildTestFiles(): TestFileSpec[] {
  return [
    {
      fileName: "sandbox-test-scenario.md",
      content: SANDBOX_TEST,
      generatedFrom: ["test-sandbox"],
    },
    {
      fileName: "validation-log-template.md",
      content: VALIDATION_LOG,
      generatedFrom: ["test-validation-log"],
    },
  ];
}
