export type ChecklistFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const HOW_TO_USE = `> **How to use this checklist** — for each item, fill all four columns. \`Evidence\` is what proves it passes (a spec link, a screenshot, a number). \`Issue\` is what's wrong if it doesn't pass. \`Fix\` is the concrete change. \`Accepted exception\` is the reviewer-signed reason it's OK to ship anyway. An item with neither passing Evidence nor an Accepted exception blocks the stage.`;

const UX_FOUNDATION = `# UX Foundation Checklist

${HOW_TO_USE}

| # | Item | Evidence | Issue | Fix | Accepted exception |
|---|------|----------|-------|-----|--------------------|
| 1 | Primary user is named and precise (not "the customer"). | | | | |
| 2 | Primary action per screen is defined. | | | | |
| 3 | User flow covers entry, happy path, and at least one alternate / failure branch. | | | | |
| 4 | Information architecture lists every screen with a one-sentence purpose. | | | | |
| 5 | Each screen has its primary action identified. | | | | |
| 6 | Every alternate branch terminates (success / retry / exit). | | | | |
| 7 | Navigation model is named and consistent across screens. | | | | |
| 8 | Unknowns are logged as ask / default / defer (no silent assumptions). | | | | |
`;

const UI_DESIGN = `# UI Design Checklist

${HOW_TO_USE}

| # | Item | Evidence | Issue | Fix | Accepted exception |
|---|------|----------|-------|-----|--------------------|
| 1 | Each screen has a written specification (\`templates/screen-spec-template.md\`). | | | | |
| 2 | Components are named, reused across screens, and documented (props / variants / states). | | | | |
| 3 | Every screen lists all 4 states: default / empty / loading / error. | | | | |
| 4 | Empty state has a defined "next step". | | | | |
| 5 | Error state has a defined recovery path. | | | | |
| 6 | Responsive notes exist for mobile / tablet / desktop. | | | | |
| 7 | Tokens are used for color / type / spacing / radius (no raw values). | | | | |
| 8 | Accessibility: contrast AA, focus visible, touch targets meet minimums. | | | | |
| 9 | Hierarchy ranked and ≤ 5 items per screen. | | | | |
`;

const HANDOFF = `# Handoff Checklist

${HOW_TO_USE}

| # | Item | Evidence | Issue | Fix | Accepted exception |
|---|------|----------|-------|-----|--------------------|
| 1 | Implementation prompt generated (\`templates/cursor-prompt-template.md\`). | | | | |
| 2 | Screen specifications attached or linked from the handoff package. | | | | |
| 3 | Tokens / theme references included. | | | | |
| 4 | Telemetry events listed per screen. | | | | |
| 5 | Open questions resolved or explicitly deferred. | | | | |
| 6 | Validation log shows no unresolved blockers. | | | | |
| 7 | Release checklist (\`checklists/release-checklist.md\`) is fully ticked. | | | | |
| 8 | Owner + escalation path documented. | | | | |
`;

const RELEASE = `# Release Checklist

${HOW_TO_USE}

| # | Item | Evidence | Issue | Fix | Accepted exception |
|---|------|----------|-------|-----|--------------------|
| 1 | All WORK_UNIT.json stage \`exitCriteria\` are met. | | | | |
| 2 | All sandbox scenarios in \`tests/sandbox-test-scenario.md\` pass or have an accepted exception in \`tests/validation-log-template.md\`. | | | | |
| 3 | \`CATALOG.md\` lists every file present in the kit. | | | | |
| 4 | \`HOOKS.json\` triggers reviewed for collisions. | | | | |
| 5 | Every \`HOOKS.json\` \`routeTo.stage\` resolves to a stage in \`WORK_UNIT.json\`. | | | | |
| 6 | Version bumped in \`SKILL.md\` frontmatter. | | | | |
| 7 | \`README.md\` install / usage section reflects the current kit structure. | | | | |
| 8 | Ownership and escalation path documented for the released kit. | | | | |
| 9 | Stage guides under \`references/stage-guides/\` exist for every stage in \`WORK_UNIT.json\`. | | | | |
`;

export function buildChecklistFiles(): ChecklistFileSpec[] {
  return [
    {
      fileName: "ux-foundation-checklist.md",
      content: UX_FOUNDATION,
      generatedFrom: ["chk-ux-foundation"],
    },
    {
      fileName: "ui-design-checklist.md",
      content: UI_DESIGN,
      generatedFrom: ["chk-ui-design"],
    },
    {
      fileName: "handoff-checklist.md",
      content: HANDOFF,
      generatedFrom: ["chk-handoff"],
    },
    {
      fileName: "release-checklist.md",
      content: RELEASE,
      generatedFrom: ["chk-release"],
    },
  ];
}
