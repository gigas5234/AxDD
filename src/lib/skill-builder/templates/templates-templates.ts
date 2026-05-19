export type TemplateFileSpec = {
  fileName: string;
  content: string;
  generatedFrom: string[];
};

const UX_BRIEF = `# UX Brief Template

## 1. Problem
- Restate the user problem in one sentence:
- Trigger / context:

## 2. Primary user
- Who:
- Goal:
- Constraints:

## 3. Success criteria
- Behavior we expect after this ships:
- Metric (qualitative or quantitative):

## 4. Scope
- In scope:
- Out of scope:

## 5. Open questions
- Unknown 1:
- Unknown 2:
`;

const SCREEN_SPEC = `# Screen Specification Template

## Screen name
\`<ScreenName>\`

## Purpose
One sentence describing why this screen exists.

## Primary action
The single action the user is here to perform.

## Information hierarchy
1. Most important content
2. Second
3. Third

## Components
- ComponentName — purpose, variants, props

## States
- **Default** —
- **Empty** —
- **Loading** —
- **Error** —

## Responsive notes
- Mobile (<640):
- Tablet (640–1023):
- Desktop (≥1024):

## Implementation notes
- Tokens used:
- Edge cases:
`;

const CURSOR_PROMPT = `# Cursor-Ready Implementation Prompt

You are implementing one screen from a designed product.

## Context
- Product: <product>
- Screen: <ScreenName>
- Framework: React + Tailwind
- Design system: <design-system-name>

## Goal
Implement \`<ScreenName>\` matching the spec below.

## Spec
<paste screen specification here>

## Tokens
<paste tokens or import path>

## Acceptance criteria
- [ ] Primary action is visually dominant
- [ ] All four states are implemented (default, empty, loading, error)
- [ ] Responsive at mobile / tablet / desktop
- [ ] Keyboard reachable, focus visible
- [ ] No vague styling — use tokens, not raw values

## Output
- A single React component file
- Tailwind classes only (no inline style except dynamic values)
- Brief notes on assumptions at the end
`;

const DESIGN_REVIEW = `# Design Review Template

## Screen reviewed
\`<ScreenName>\`

## Summary
One-line verdict.

## Findings

### Usability
- [ ] Finding —

### Accessibility
- [ ] Finding —

### Consistency
- [ ] Finding —

## Prioritized fixes
| # | Issue | Impact | Effort | Owner |
|---|-------|--------|--------|-------|
| 1 |       |        |        |       |
| 2 |       |        |        |       |
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
