import type { CapabilityPack } from "@/types/skill";

export type CapabilityPackEffect = {
  filesAdded: string[];
  skillMdSections: string[];
  rulesAdded: string[];
};

export type CapabilityPackDef = {
  id: CapabilityPack;
  label: string;
  summary: string;
  sourceInspiration: string;
  effect: CapabilityPackEffect;
  referenceFile?: { fileName: string; content: string };
  skillMdSection?: { heading: string; body: string };
  extraRules?: string[];
  recommendedDefault?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Design Taste — opinionated aesthetic filter
// ─────────────────────────────────────────────────────────────────────────────
const DESIGN_TASTE: CapabilityPackDef = {
  id: "design-taste",
  label: "Design Taste",
  summary:
    "Opinionated aesthetic — restraint, hierarchy via size/weight, single accent, measurable rules.",
  sourceInspiration: "design-taste-frontend, high-end-visual-design (skills.sh)",
  recommendedDefault: true,
  effect: {
    filesAdded: ["references/design-taste.md"],
    skillMdSections: ["Aesthetic principles"],
    rulesAdded: [
      "Use whitespace before borders.",
      "Hierarchy comes from size + weight, not color.",
      "Reserve the single accent color for interactive signals.",
    ],
  },
  referenceFile: {
    fileName: "design-taste.md",
    content: `# Design Taste

Twelve opinionated rules that separate "professional" from "decorative."

## 1. Restraint
- A page that needs three colors is usually wrong. One neutral, one ink, one accent — that's the budget.
- A page that needs three font weights is usually wrong. One for hierarchy, one for body.

## 2. Hierarchy via size and weight, not color
- Color is reserved for interactive signals (links, primary action, errors). Headlines lead with size and weight.

## 3. Whitespace before borders
- If two regions need separation, try 24-32px of whitespace first. Reach for borders only when whitespace fails.

## 4. Optical, not mathematical
- A circular button looks heavy at its mathematical center. Nudge it 1-2px up.
- A button labeled "Save" reads heavier than "Cancel." Pad accordingly.

## 5. Default state is the design
- Empty, loading, and error states are not optional. Design them first; default is the easy part.

## 6. Chrome recedes
- Borders, shadows, frames recede around content. Photography and product imagery never compete with chrome.

## 7. One motion per surface, at most
- Reserve animation for moments that teach (entry of a new affordance) or acknowledge (after an action).
- Respect \`prefers-reduced-motion\`.

## 8. Tighten display, breathe body
- Display (40px+) wants negative letter-spacing (-0.3 to -0.5px).
- Body (16-17px) wants relaxed leading (1.45-1.60).

## 9. Numbers replace adjectives
- "Modern", "clean", "intuitive" mean nothing. Replace with measurements: "8pt grid", "44px touch target", "WCAG AA contrast."

## 10. Black is rarely #000
- True black reads "printed." Most premium products use a soft black like #1B1B1B on light surfaces.

## 11. Borders are a last resort
- A 1px border at low opacity (4-8%) often does the job. Full hairlines at full opacity are loud.

## 12. The boring decision is usually right
- System fonts. 8pt grid. Single accent. 4-state design.
- Boring is the foundation; taste is what you *don't* add.
`,
  },
  skillMdSection: {
    heading: "Aesthetic principles",
    body: `Apply these taste filters to every visual decision:

- **Restraint** — one neutral, one ink, one accent. Stop there.
- **Hierarchy via size and weight, not color.** Color is reserved for interactive signals.
- **Whitespace before borders.** 24-32px of air separates regions before a 1px line.
- **Default state is the design.** Empty / loading / error are first-class, not afterthoughts.
- **Numbers replace adjectives.** Replace "modern" / "clean" with measurements ("8pt grid", "WCAG AA", "44px target").
- **Black is rarely #000.** Use a soft black (#1B1B1B) on light surfaces.
- **One motion per surface, at most.** Motion teaches or acknowledges — never decorates.

When violating any of these, justify it in the spec.`,
  },
  extraRules: [
    "Apply the Design Taste filter to every visual decision; flag exceptions explicitly.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Web Best Practices
// ─────────────────────────────────────────────────────────────────────────────
const WEB_BEST_PRACTICES: CapabilityPackDef = {
  id: "web-best-practices",
  label: "Web Best Practices",
  summary:
    "Responsive grids, fluid type, touch targets, layout shift, and loading patterns for the web.",
  sourceInspiration: "web-design-guidelines (vercel-labs/agent-skills)",
  recommendedDefault: true,
  effect: {
    filesAdded: ["references/web-best-practices.md"],
    skillMdSections: ["Web platform rules"],
    rulesAdded: [
      "Layout never shifts after first paint above the fold (CLS = 0).",
      "Touch targets ≥ 44×44 px on mobile.",
      "Use intrinsic sizing for images to prevent reflow.",
    ],
  },
  referenceFile: {
    fileName: "web-best-practices.md",
    content: `# Web Best Practices

Web-platform-specific rules for shipping production UI.

## Responsive
- Use intrinsic media queries (\`@container\`) over viewport-only queries where layout depends on the *component's* width, not the page.
- Define 4 breakpoints max: mobile / tablet / desktop / wide. More than 4 is usually unmaintained.
- Typography uses \`clamp()\` for fluid scaling, not 4 separate sizes.

## Performance budgets
- LCP < 2.5s on mid-tier mobile.
- CLS = 0 above the fold. Reserve space for every image, embed, and dynamic block.
- Total JS payload < 250 KB gzipped for the initial route.

## Images
- Always declare \`width\` and \`height\` (or use \`aspect-ratio\`).
- Use \`loading="lazy"\` for below-the-fold images, \`fetchpriority="high"\` for the LCP image.
- Prefer modern formats (\`webp\`/\`avif\`) with fallbacks.

## Touch targets
- 44×44 px minimum on mobile, 32×32 minimum on desktop.
- Add invisible padding before reducing the visual element size.

## Loading patterns
- Skeleton screens > spinners for content-shaped loading.
- Optimistic UI for the primary action when the operation is idempotent.
- Show progress only when total > 1 second.

## Keyboard
- Every interactive element is reachable by Tab in a logical order.
- \`Enter\` activates buttons; \`Space\` activates checkboxes/buttons.
- Focus visible at all times — never \`outline: 0\` without a replacement.

## SEO basics
- One \`h1\` per page.
- Heading hierarchy is contiguous (no h2 → h4 skip).
- Page titles are descriptive and unique.
`,
  },
  skillMdSection: {
    heading: "Web platform rules",
    body: `When the target surface is the web, honor these constraints:

- **CLS = 0 above the fold.** Reserve space for every image, embed, and dynamic block.
- **Touch targets ≥ 44×44 px** on mobile, ≥ 32×32 on desktop.
- **Intrinsic sizing** — declare \`width\`/\`height\` or \`aspect-ratio\` for media.
- **4 breakpoints max** — mobile / tablet / desktop / wide. Define them once, reuse.
- **Skeleton over spinner** for content-shaped loading.
- **Keyboard reachable** — every interactive element via Tab, focus always visible.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Theme Factory — design token generation
// ─────────────────────────────────────────────────────────────────────────────
const THEME_FACTORY: CapabilityPackDef = {
  id: "theme-factory",
  label: "Theme Factory",
  summary:
    "Generate a complete design token JSON (color, typography, spacing, radius) alongside specs.",
  sourceInspiration: "theme-factory (anthropics/skills)",
  effect: {
    filesAdded: [
      "references/token-scales.md",
      "templates/theme-tokens-template.md",
    ],
    skillMdSections: ["Design token output"],
    rulesAdded: [
      "Every screen spec ships with a matching token JSON.",
      "Tokens are semantic (surface, ink, accent), not literal (blue-500).",
    ],
  },
  referenceFile: {
    fileName: "token-scales.md",
    content: `# Token Scales

Reference scales for color, typography, spacing, and radius.

## Color — semantic, not literal
- \`surface\` — page background
- \`surface-elevated\` — card background
- \`ink\` — primary text
- \`ink-muted\` — secondary text
- \`accent\` — primary interactive
- \`accent-on\` — text on accent
- \`hairline\` — 1px borders
- \`success\`, \`warning\`, \`danger\` — status signals

## Typography
- \`display\` — 40px / 600 / -0.3px
- \`title\` — 28px / 600 / -0.2px
- \`subtitle\` — 21px / 600 / -0.1px
- \`body-strong\` — 17px / 600
- \`body\` — 17px / 400
- \`caption\` — 14px / 400
- \`fine-print\` — 12px / 400

## Spacing — 8pt grid
- \`xxs\` 4 · \`xs\` 8 · \`sm\` 12 · \`md\` 16 · \`lg\` 24 · \`xl\` 32 · \`xxl\` 48 · \`section\` 80

## Radius
- \`xs\` 5 · \`sm\` 8 · \`md\` 11 · \`lg\` 18 · \`pill\` 9999

## Shadow
- One \`product\` shadow reserved for hero imagery only. UI never carries shadows.
`,
  },
  skillMdSection: {
    heading: "Design token output",
    body: `Every screen spec ships with a matching design token JSON. Tokens are *semantic* (surface, ink, accent), never literal (blue-500). Use the template at \`templates/theme-tokens-template.md\` as the output shape. When a screen needs a value not in the token set, add the token to the set rather than inline the value.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Tailwind-First Output
// ─────────────────────────────────────────────────────────────────────────────
const TAILWIND_FIRST: CapabilityPackDef = {
  id: "tailwind-first",
  label: "Tailwind-First Output",
  summary:
    "All implementation outputs use Tailwind utility classes; tokens map to Tailwind theme keys.",
  sourceInspiration: "tailwind-design-system (wshobson/agents)",
  recommendedDefault: true,
  effect: {
    filesAdded: ["references/tailwind-mapping.md"],
    skillMdSections: ["Tailwind output rules"],
    rulesAdded: [
      "Express styling as Tailwind utility classes, not inline styles.",
      "Token references use Tailwind theme keys (bg-primary, text-ink, etc.).",
    ],
  },
  referenceFile: {
    fileName: "tailwind-mapping.md",
    content: `# Tailwind Mapping

How tokens map to Tailwind utility classes.

## Color tokens
| Token | Tailwind class |
|---|---|
| \`surface\` | \`bg-canvas\` |
| \`surface-elevated\` | \`bg-canvas-parchment\` |
| \`ink\` | \`text-ink\` |
| \`ink-muted\` | \`text-ink-muted-48\` |
| \`accent\` | \`bg-primary\` / \`text-primary\` |
| \`accent-on\` | \`text-body-on-dark\` |
| \`hairline\` | \`border-hairline\` |

## Spacing
- 4 → \`p-1\` · 8 → \`p-2\` · 12 → \`p-3\` · 16 → \`p-4\` · 24 → \`p-6\` · 32 → \`p-8\` · 48 → \`p-12\` · 80 → \`p-20\`

## Radius
- \`xs\` → \`rounded-xs\` · \`sm\` → \`rounded-sm\` · \`md\` → \`rounded-md\` · \`lg\` → \`rounded-lg\` · \`pill\` → \`rounded-pill\`

## Patterns
- Never use \`style={{ ... }}\` except for dynamic values.
- Never use raw \`#hex\` in JSX. Always token via theme key.
- Use \`@apply\` sparingly — only for genuinely repeated patterns. Prefer composition.

## Component scaffold
\`\`\`tsx
export function Button({ children, variant = "primary", ...rest }) {
  const base = "rounded-pill text-[17px] px-[22px] py-[11px] transition";
  const styles = {
    primary: \`\${base} bg-primary text-body-on-dark hover:opacity-95\`,
    secondary: \`\${base} border border-primary text-primary\`,
  };
  return <button className={styles[variant]} {...rest}>{children}</button>;
}
\`\`\`
`,
  },
  skillMdSection: {
    heading: "Tailwind output rules",
    body: `Implementation outputs assume Tailwind:

- Styling is Tailwind utility classes, not inline styles.
- Token references use Tailwind theme keys: \`bg-primary\`, \`text-ink\`, \`border-hairline\`.
- Never write raw \`#hex\` in component code — always via the theme key.
- Use \`style={{ ... }}\` only for genuinely dynamic values (computed positions, percentages from data).
- \`@apply\` is reserved for genuinely repeated patterns; prefer composition.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. shadcn/ui Affinity
// ─────────────────────────────────────────────────────────────────────────────
const SHADCN_AFFINITY: CapabilityPackDef = {
  id: "shadcn-affinity",
  label: "shadcn/ui Affinity",
  summary:
    "Prefer shadcn/ui primitives when designing components; map specs to existing shadcn parts.",
  sourceInspiration: "shadcn (shadcn/ui)",
  effect: {
    filesAdded: ["references/shadcn-primitives.md"],
    skillMdSections: ["shadcn primitive mapping"],
    rulesAdded: [
      "Before defining a new component, check if a shadcn primitive fits.",
    ],
  },
  referenceFile: {
    fileName: "shadcn-primitives.md",
    content: `# shadcn/ui Primitives

When designing components, map them to shadcn primitives first.

## Common mappings
| Need | shadcn primitive |
|---|---|
| Button | \`Button\` (variants: default, secondary, ghost, destructive, outline) |
| Modal / dialog | \`Dialog\` |
| Side panel | \`Sheet\` |
| Dropdown menu | \`DropdownMenu\` |
| Select | \`Select\` (single) / \`Combobox\` (search) |
| Tabs | \`Tabs\` |
| Tooltip | \`Tooltip\` |
| Toast | \`Sonner\` (recommended over deprecated \`Toast\`) |
| Form | \`Form\` + \`Input\` + \`Label\` |
| Table | \`Table\` + \`@tanstack/react-table\` |
| Calendar / date | \`Calendar\` + \`Popover\` |
| Command palette | \`Command\` |
| Avatar | \`Avatar\` |
| Card | \`Card\` |

## When to roll your own
- The primitive does not exist (rare).
- The needed behavior is incompatible with shadcn's prop API.
- Brand requires a fundamentally different interaction model.

In all other cases, customize via Tailwind classes on the shadcn primitive — do not fork.
`,
  },
  skillMdSection: {
    heading: "shadcn primitive mapping",
    body: `Before defining a new component, check the shadcn primitive list at \`references/shadcn-primitives.md\`. The default is *use the primitive, customize via Tailwind*. Roll a new component only when no primitive fits or the interaction model is fundamentally different.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Mobile Patterns
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_PATTERNS: CapabilityPackDef = {
  id: "mobile-patterns",
  label: "Mobile Patterns",
  summary:
    "Bottom sheets, swipe actions, pull-to-refresh, safe-area, haptics — mobile-native patterns.",
  sourceInspiration: "sleek-design-mobile-apps (sleekdotdesign)",
  effect: {
    filesAdded: ["references/mobile-patterns.md"],
    skillMdSections: ["Mobile-native patterns"],
    rulesAdded: [
      "When the target surface is mobile, prefer bottom sheets over modals.",
      "Respect safe-area insets on iOS and Android.",
      "Provide haptic feedback for primary actions on touch.",
    ],
  },
  referenceFile: {
    fileName: "mobile-patterns.md",
    content: `# Mobile-Native Patterns

Patterns that exist on mobile but not (usefully) on web.

## Bottom sheet
- Primary modal surface on mobile. Use instead of centered modal.
- Drag handle at top, snap points (peek / half / full).
- Dismissible by drag-down OR backdrop tap.

## Swipe actions
- Reveal destructive (delete, archive) actions on row left-swipe.
- Always confirm destructive actions with a second tap, never on the swipe itself.

## Pull-to-refresh
- Only when the screen is content-list-shaped.
- Show a spinner that responds to drag distance, not a static one.

## Safe-area
- iOS: top notch, bottom home indicator. Always respect \`env(safe-area-inset-*)\`.
- Android: top status bar, gesture area at bottom. Same handling.

## Haptics
- Light tap → primary action confirmed.
- Medium → destructive confirmed.
- Heavy / failure → error.
- Never haptic on every interaction.

## Touch targets
- Minimum 44×44 px (iOS HIG) / 48 dp (Material).
- Distance between adjacent targets ≥ 8 px to prevent fat-finger errors.

## Gestures
- Swipe right from left edge → back navigation (iOS).
- Long press → contextual menu.
- Two-finger gestures are rare; document when used.

## Loading & offline
- Show last-known-good content immediately; refresh in background.
- Optimistic UI for actions that *should* succeed (likes, saves).
- Explicit "offline" banner when network is gone, not just spinners.
`,
  },
  skillMdSection: {
    heading: "Mobile-native patterns",
    body: `When the target surface is mobile, prefer mobile-native primitives:

- **Bottom sheets over centered modals.** Drag handle, snap points, dismiss by drag-down.
- **Swipe actions for destructive operations**, with a second tap to confirm.
- **Pull-to-refresh** only for content-list screens.
- **Safe-area insets** are respected on iOS notch and Android gesture area.
- **Haptic feedback** for primary action confirmation, not for every tap.
- **Touch targets ≥ 44 px**, with ≥ 8 px between adjacent targets.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Extract Existing Design System
// ─────────────────────────────────────────────────────────────────────────────
const EXTRACT_DESIGN_SYSTEM: CapabilityPackDef = {
  id: "extract-design-system",
  label: "Extract Existing System",
  summary:
    "Reverse-engineer an existing screen or codebase into tokens, primitives, and component rules.",
  sourceInspiration: "extract-design-system (arvindrk)",
  effect: {
    filesAdded: ["references/extract-design-system.md"],
    skillMdSections: ["Reverse-engineering workflow"],
    rulesAdded: [
      "When given existing UI, extract tokens before proposing changes.",
    ],
  },
  referenceFile: {
    fileName: "extract-design-system.md",
    content: `# Extract Existing Design System

When the user provides existing screens, code, or screenshots, reverse-engineer the implicit design system before proposing changes.

## Extraction order

1. **Color** — sample every distinct color from the source. Group near-duplicates (#FAFAFA + #FAFAFB → one token).
2. **Typography** — list every (size, weight, line-height, letter-spacing) combination. Group near-duplicates.
3. **Spacing** — measure every gap. Snap to the nearest grid (4 or 8). Note grid violations.
4. **Radius** — list every distinct radius. Group near-duplicates.
5. **Component patterns** — identify repeated visual structures (cards, list rows, headers).

## Output shape

\`\`\`json
{
  "tokens": {
    "color": { "<name>": "<hex>" },
    "typography": { "<name>": { "size": 0, "weight": 0, "lineHeight": 0, "letterSpacing": 0 } },
    "spacing": { "<name>": 0 },
    "radius": { "<name>": 0 }
  },
  "primitives": [
    { "name": "Button", "variants": ["primary", "secondary"], "states": ["default", "hover", "active", "disabled"] }
  ],
  "violations": [
    "Two near-identical grays (#5A5A5A vs #595959) — collapse to one.",
    "Three font sizes within 1px of each other — collapse to one."
  ]
}
\`\`\`

## Common mistakes

- Inventing token names that don't match the source's language.
- Snapping to a grid that doesn't exist in the source (forcing 8pt when source is 6pt).
- Missing variants because they appeared only on one screen.

## Anti-recommendations

After extraction, separately list:
- **Inconsistencies to flag** — places where the source violates its own pattern.
- **Gaps to fill** — primitives or states that should exist but don't yet.
`,
  },
  skillMdSection: {
    heading: "Reverse-engineering workflow",
    body: `When the user provides existing screens, code, or screenshots, run the extraction workflow before proposing changes:

1. Extract color, typography, spacing, radius, and component patterns from the source.
2. Group near-duplicates into single tokens.
3. List violations (places where the source contradicts itself).
4. Propose changes *in the source's own language*, not yours.

Output the extraction as a structured JSON before any design recommendations.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Visual Composition
// ─────────────────────────────────────────────────────────────────────────────
const VISUAL_COMPOSITION: CapabilityPackDef = {
  id: "visual-composition",
  label: "Visual Composition",
  summary:
    "Gestalt principles, optical alignment, grid systems, visual rhythm — pure composition rules.",
  sourceInspiration: "canvas-design (anthropics/skills)",
  effect: {
    filesAdded: ["references/visual-composition.md"],
    skillMdSections: ["Visual composition principles"],
    rulesAdded: [
      "Compose by visual rhythm (8pt grid), not pixel-precise placement.",
    ],
  },
  referenceFile: {
    fileName: "visual-composition.md",
    content: `# Visual Composition

Composition rules that apply before color and typography.

## Gestalt principles
- **Proximity** — elements that are close are perceived as related.
- **Similarity** — same color / shape / size implies same role.
- **Continuity** — the eye follows the smoothest path.
- **Closure** — the mind completes incomplete shapes; use this to imply structure with less ink.
- **Figure / ground** — make the figure visually heavier than the ground.

## Grid systems
- 8pt grid for layout. 4pt for tight typographic adjustments.
- 12-column grid for desktop, 4-column for mobile.
- Container width locks: 1440 max content, 1068 small desktop, 834 tablet, 640 phone.

## Optical alignment
- Centered text in a button needs slightly more bottom padding than top (descenders).
- A triangle pointing right looks centered when its mathematical center is left of the container's center.
- Round shapes appear smaller than squares of the same dimension. Compensate.

## Visual rhythm
- Establish a vertical rhythm (line-height multiple) and stick to it.
- Section spacing should be a clear multiple of body line-height.

## Weight balance
- The most important element should carry the most visual weight (size + contrast + isolation).
- Two "primary" elements means one is wrong. Demote one.

## Density
- Information-rich screens (tables, dashboards) tolerate higher density.
- Marketing surfaces breathe — at least 64px of vertical air around hero content.
`,
  },
  skillMdSection: {
    heading: "Visual composition principles",
    body: `Apply composition rules before color and typography decisions:

- **Gestalt** — proximity, similarity, continuity, closure, figure/ground.
- **8pt grid** for layout, **4pt** for tight typographic adjustments.
- **Optical alignment** — round shapes are perceived smaller than squares; compensate.
- **Visual rhythm** — establish a vertical rhythm and stick to it.
- **Single most-important element** per surface. Two "primary" elements means one is wrong.`,
  },
};

export const CAPABILITY_PACKS: CapabilityPackDef[] = [
  DESIGN_TASTE,
  WEB_BEST_PRACTICES,
  THEME_FACTORY,
  TAILWIND_FIRST,
  SHADCN_AFFINITY,
  MOBILE_PATTERNS,
  EXTRACT_DESIGN_SYSTEM,
  VISUAL_COMPOSITION,
];

export function getCapabilityPack(id: CapabilityPack): CapabilityPackDef | undefined {
  return CAPABILITY_PACKS.find((p) => p.id === id);
}

export function recommendedDefaultPacks(): CapabilityPack[] {
  return CAPABILITY_PACKS.filter((p) => p.recommendedDefault).map((p) => p.id);
}
