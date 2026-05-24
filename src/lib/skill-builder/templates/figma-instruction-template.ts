export const FIGMA_INSTRUCTION_TEMPLATE = `# Figma Manual Instruction Template (Enterprise Fallback)

> **When to use this template**
> Use this template when **Figma MCP is unavailable** — for example, in enterprise environments where the Figma MCP server is blocked by IT policy, behind a corporate proxy, or otherwise inaccessible. This template lets a designer rebuild the screen by hand and feed the result back into the kit workflow.

## Prerequisites

- [ ] Figma file URL: \`<paste-url>\`
- [ ] Target page name: \`<page-name>\`
- [ ] Frame naming convention: \`Screen / <ScreenName> / <state>\`
- [ ] Design system library attached: yes / no
- [ ] Screen specification ready (\`templates/screen-spec-template.md\`)

## Step-by-step manual build

1. **Create page and frame**
   - Add a new page (or reuse the target page).
   - Create a frame per breakpoint (mobile / tablet / desktop). Name them per the convention above.

2. **Apply the layout grid**
   - Mobile: 4-col, 16px gutter, 16px margin.
   - Tablet: 8-col, 16px gutter, 24px margin.
   - Desktop: 12-col, 24px gutter, 32px margin.

3. **Place components from the design system**
   - Use only library components. Do not detach unless absolutely required.
   - Match the component breakdown from the screen specification.

4. **Apply design tokens**
   - Use shared styles / variables for color, typography, spacing, and radius.
   - Do not hardcode hex / px values. If a token is missing, log it in **Open Issues** below.

5. **Mark all states**
   - Build a frame for each of: **default / empty / loading / error**.
   - Add a short caption per state describing the trigger and the next step.

6. **Export specs**
   - Use Inspect / Dev Mode to capture spacing, type, and color values.
   - Export icons and images at the resolutions needed for engineering.

## Parity checklist (must match the screen spec)

- [ ] Primary action present and visually dominant
- [ ] Information hierarchy matches the spec ranking
- [ ] All 4 states present (default / empty / loading / error)
- [ ] Responsive variants exist for mobile / tablet / desktop
- [ ] All colors, type, spacing, radius use tokens (no raw values)
- [ ] All icons / images are exportable assets
- [ ] Each interactive element has a focus / hover treatment defined

## Feeding the result back into the workflow

1. Update \`templates/screen-spec-template.md\` for this screen with any deltas discovered during the manual build.
2. Attach the Figma frame links to the screen spec.
3. Advance to **Review & Validation** stage and run \`templates/design-review-template.md\` against the built frames.
4. Log the run in \`tests/validation-log-template.md\`.

## Open issues

| # | Issue | Blocker? | Owner | Notes |
|---|-------|----------|-------|-------|
| 1 |       |          |       |       |
| 2 |       |          |       |       |
`;
