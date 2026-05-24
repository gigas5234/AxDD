export type ChecklistFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const UX_FOUNDATION = `# UX Foundation Checklist

Exit gate for the **UX Foundation** stage. All boxes must be ticked or have an accepted exception logged in \`tests/validation-log-template.md\`.

- [ ] Primary user is named and precise (not "the customer").
- [ ] Primary action per screen is defined.
- [ ] User flow covers entry, happy path, and at least one alternate / failure branch.
- [ ] Information architecture lists every screen with a one-sentence purpose.
- [ ] Each screen has its primary action identified.
- [ ] Unknowns are logged as ask / default / defer (no silent assumptions).
`;

const UI_DESIGN = `# UI Design Checklist

Exit gate for **UI Design Foundation** and used again during **Review & Validation**.

- [ ] Each screen has a written specification using \`templates/screen-spec-template.md\`.
- [ ] Components are named, reused across screens, and documented (props / variants / states).
- [ ] Every screen lists all 4 states: default / empty / loading / error.
- [ ] Empty state has a defined "next step".
- [ ] Error state has a defined recovery path.
- [ ] Responsive notes exist for mobile / tablet / desktop.
- [ ] Tokens are used for color / type / spacing / radius (no raw values).
- [ ] Accessibility: contrast AA, focus visible, touch targets meet minimums.
`;

const HANDOFF = `# Handoff Checklist

Exit gate for the **Handoff** stage before engineering picks up the work.

- [ ] Implementation prompt generated using \`templates/cursor-prompt-template.md\`.
- [ ] Screen specifications attached or linked from the handoff package.
- [ ] Tokens / theme references included.
- [ ] Open questions resolved or explicitly deferred.
- [ ] Validation log shows no unresolved blockers (\`tests/validation-log-template.md\`).
- [ ] Release checklist (\`checklists/release-checklist.md\`) is fully ticked.
`;

const RELEASE = `# Release Checklist

Final gate before this kit (or its output) is released. Every item must be ticked.

- [ ] All WORK_UNIT.json stage \`exitCriteria\` are met.
- [ ] All sandbox scenarios in \`tests/sandbox-test-scenario.md\` pass or have an accepted exception in \`tests/validation-log-template.md\`.
- [ ] \`CATALOG.md\` lists every file present in the kit.
- [ ] \`HOOKS.json\` triggers reviewed for collisions (no two hooks share a trigger).
- [ ] Version bumped in \`SKILL.md\` frontmatter.
- [ ] \`README.md\` install / usage section reflects the current kit structure.
- [ ] Ownership and escalation path documented for the released kit.
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
