# CLAUDE.md

# AxDD Skill Builder — MVP Implementation Guide

This file defines the product direction, MVP scope, generation logic, UX structure, data model, and implementation rules for building **AxDD Skill Builder**.

The goal is to create a web application that lets users compose, preview, edit, regenerate, translate, and download AI Agent Skill packages, starting with a UX/UI Designer Skill and expanding later into other skill categories.

---

## 1. Product Summary

### Product Name

**AxDD Skill Builder**

Alternative internal names:

- Skill Composer
- SkillForge
- AxDD Skill Kit
- Skill Package Builder

### One-Line Description

AxDD Skill Builder helps designers and makers create structured AI Agent `SKILL.md` packages by selecting work goals, roles, workflows, output formats, and rules through a guided web interface.

### Core Concept

The service should not be a simple prompt generator.

It should behave like a **Skill Composer**:

1. The user selects a purpose.
2. The user chooses recommended or detailed settings.
3. The system generates a structured skill package.
4. The user can preview each generated file in the browser.
5. The user can edit or partially regenerate files.
6. The user can view English and Korean versions when needed.
7. The user can download the result as a ZIP package.

---

## 2. MVP Scope

### Initial MVP Focus

The first MVP should focus only on:

```txt
UX/UI Designer Skill Builder
```

Do not try to support every possible skill category in the first version.

The initial default skill should generate a package for:

```txt
AI-assisted UX/UI design workflow
```

### Future Expansion Categories

The internal structure must support future categories:

```txt
- UX/UI Designer
- Product Planner
- Frontend Implementation
- Figma to Code
- Design System Generator
- Code Review
- Data Analysis
- Research Assistant
- Content Planner
- Customer Support
```

For the MVP, only expose `UX/UI Designer` in the UI, but design the data model to support all future categories.

---

## 3. Main User Flow

### Basic Flow

```txt
Home
  ↓
Choose Skill Type
  ↓
Select Default Preset or Customize
  ↓
Configure Detailed Settings
  ↓
Generate Skill Package
  ↓
Preview File Tree
  ↓
Edit / Translate / Regenerate
  ↓
Download ZIP
```

### MVP User Journey

1. User enters the builder.
2. The default category is `UX/UI Designer`.
3. The system shows recommended default settings.
4. User can either:
   - use recommended settings immediately, or
   - open detailed settings and customize.
5. User clicks `Generate Skill`.
6. The app creates a file tree:
   - `SKILL.md`
   - `README.md`
   - `references/*.md`
   - `templates/*.md`
   - `examples/*.md`
7. User clicks each file to preview it in the browser.
8. User can switch between:
   - Rendered Markdown
   - Raw Markdown
   - Korean Preview
9. User can edit a file directly.
10. User can regenerate only the selected file or section.
11. User can download the final package as a ZIP.

---

## 4. Product Principles

### Principle 1 — Block-Based Generation

Do not generate everything from scratch every time.

Use reusable blocks:

```txt
Role Blocks
Workflow Blocks
Output Blocks
Rule Blocks
Template Blocks
Reference Blocks
Example Blocks
```

The generation engine should compose selected blocks into final files.

### Principle 2 — Defaults First, Detail Later

The MVP must be easy to use.

The default experience should be:

```txt
Choose UX/UI Designer → Generate → Preview → Download
```

Detailed customization should be available but not required.

### Principle 3 — Preview Before Download

The user should never download an unknown ZIP.

The generated package must be visible in the browser through a file tree.

### Principle 4 — Partial Regeneration

The user should not have to regenerate the entire package after a small edit.

Support regeneration at these levels:

```txt
- Whole package
- One file
- One section inside a file
```

### Principle 5 — English First, Korean Preview Optional

Generated skills should use English as the primary language because many AI Agent systems and developer workflows operate better with English instructions.

However, Korean users should be able to understand the content.

Use this strategy:

```txt
Default: English only generation
Optional: Korean preview on demand
Optional: Korean translation cached after generation
Optional: Korean side-by-side view
```

Do not generate Korean translations for every file by default because it increases token usage and slows generation.

---

## 5. Recommended Default Settings

The first version should include one strong recommended preset.

### Default Preset Name

```txt
UX/UI Designer — AxDD Default
```

### Default Purpose

```txt
Create an AI-assisted UX/UI design skill that transforms product ideas, rough requirements, screenshots, or feature requests into structured UX strategy, screen design, design-system-aware specifications, and implementation-ready prompts.
```

### Default Role

```txt
Senior UX/UI Designer with frontend implementation awareness
```

### Default User Type

```txt
Designer, maker, or product builder using AI tools to plan and implement web or mobile products.
```

### Default Agent Environment

```txt
Generic Agent Skill
```

Future options:

```txt
- Claude Code
- Cursor
- Codex
- Windsurf
- Generic Agent
```

### Default Workflow Modules

Enable these by default:

```txt
- UX Strategy
- Screen Design
- Design System Draft
- Figma to Code
- UX Review
```

### Default Output Modules

Enable these by default:

```txt
- UX Brief
- Screen Specification
- Component Structure
- Design Token Draft
- Cursor-Ready Implementation Prompt
- UX Review Checklist
```

### Default Rules

Enable these by default:

```txt
- Do not jump directly into visual styling.
- Do not use vague words like modern, clean, intuitive, or premium without concrete design rules.
- Always define the primary user action.
- Always include information hierarchy.
- Always break screens into reusable components.
- Always consider default, empty, loading, and error states.
- Always include implementation notes when producing UI specs.
- Keep chat answers concise unless the user asks for detailed documentation.
```

### Default File Package

The default generated package should include:

```txt
axdd-ux-ui-designer/
├── SKILL.md
├── README.md
├── references/
│   ├── ux-principles.md
│   ├── ui-patterns.md
│   ├── design-system-rules.md
│   └── accessibility-checklist.md
├── templates/
│   ├── ux-brief-template.md
│   ├── screen-spec-template.md
│   ├── cursor-prompt-template.md
│   └── design-review-template.md
└── examples/
    └── ux-ui-example.md
```

---

## 6. Preset Examples

The MVP should show presets as cards.

### Preset 1 — UX/UI Designer AxDD Default

Best for:

```txt
Turning rough service ideas into UX structures, screens, and implementation prompts.
```

Expected output:

```txt
- SKILL.md for UX/UI design
- UX strategy workflow
- screen specification templates
- design review checklist
- Cursor-ready prompt template
```

### Preset 2 — Figma to Code Helper

Best for:

```txt
Turning screenshots, Figma descriptions, or UI references into React/Tailwind implementation plans.
```

Expected output:

```txt
- Scene graph output rules
- Asset map template
- Tailwind implementation rules
- Cursor prompt template
```

### Preset 3 — Design System Starter

Best for:

```txt
Creating design tokens and component rules from a product direction or visual style.
```

Expected output:

```txt
- Color token rules
- typography rules
- spacing rules
- component variants
- Figma component spec template
```

### Preset 4 — UX Review Assistant

Best for:

```txt
Reviewing existing screens and finding UX/UI issues.
```

Expected output:

```txt
- Review framework
- usability checklist
- accessibility checklist
- prioritized fix format
```

For MVP, only the first preset needs full generation support. Other presets can appear as disabled or “coming soon” cards.

---

## 7. Detailed Settings Structure

The builder should expose detailed settings below the default preset.

### Setting Group 1 — Basic Info

```ts
type BasicInfoSettings = {
  skillName: string;
  packageName: string;
  description: string;
  targetCategory: "ux-ui" | "product" | "frontend" | "design-system" | "research" | "content" | "data";
  targetAgent: "generic" | "claude-code" | "cursor" | "codex" | "windsurf";
};
```

Recommended default:

```json
{
  "skillName": "axdd-ux-ui-designer",
  "packageName": "axdd-ux-ui-designer",
  "description": "AI-assisted UX/UI design workflow skill for product designers and makers.",
  "targetCategory": "ux-ui",
  "targetAgent": "generic"
}
```

### Setting Group 2 — Role Profile

```ts
type RoleProfileSettings = {
  roleLevel: "junior" | "mid" | "senior" | "expert";
  domainFocus: string[];
  implementationAwareness: boolean;
  designSystemAwareness: boolean;
  businessAwareness: boolean;
};
```

Recommended default:

```json
{
  "roleLevel": "senior",
  "domainFocus": ["UX Strategy", "UI Design", "Design Systems", "Figma to Code"],
  "implementationAwareness": true,
  "designSystemAwareness": true,
  "businessAwareness": true
}
```

### Setting Group 3 — Workflow Modules

```ts
type WorkflowModule =
  | "problem-definition"
  | "user-flow"
  | "information-architecture"
  | "screen-design"
  | "component-breakdown"
  | "design-system-draft"
  | "figma-to-code"
  | "ux-review"
  | "accessibility-check"
  | "implementation-prompt";
```

Recommended default:

```json
[
  "problem-definition",
  "user-flow",
  "information-architecture",
  "screen-design",
  "component-breakdown",
  "design-system-draft",
  "figma-to-code",
  "ux-review",
  "implementation-prompt"
]
```

### Setting Group 4 — Output Format

```ts
type OutputFormatSettings = {
  answerStyle: "concise" | "structured" | "detailed";
  includeMarkdown: boolean;
  includeJson: boolean;
  includeTables: boolean;
  includeCursorPrompt: boolean;
  includeChecklists: boolean;
  includeExamples: boolean;
};
```

Recommended default:

```json
{
  "answerStyle": "structured",
  "includeMarkdown": true,
  "includeJson": true,
  "includeTables": false,
  "includeCursorPrompt": true,
  "includeChecklists": true,
  "includeExamples": true
}
```

### Setting Group 5 — Quality Rules

```ts
type QualityRule =
  | "avoid-vague-language"
  | "define-primary-action"
  | "include-information-hierarchy"
  | "include-screen-states"
  | "componentize-output"
  | "include-responsive-notes"
  | "include-accessibility"
  | "avoid-unnecessary-questions"
  | "avoid-overlong-chat-response";
```

Recommended default:

```json
[
  "avoid-vague-language",
  "define-primary-action",
  "include-information-hierarchy",
  "include-screen-states",
  "componentize-output",
  "include-responsive-notes",
  "include-accessibility",
  "avoid-unnecessary-questions",
  "avoid-overlong-chat-response"
]
```

### Setting Group 6 — Language Settings

```ts
type LanguageSettings = {
  primaryLanguage: "en" | "ko";
  previewLanguages: ("en" | "ko")[];
  generateKoreanByDefault: boolean;
  translationMode: "none" | "on-demand" | "side-by-side" | "cached";
};
```

Recommended default:

```json
{
  "primaryLanguage": "en",
  "previewLanguages": ["en", "ko"],
  "generateKoreanByDefault": false,
  "translationMode": "on-demand"
}
```

Rationale:

```txt
Generating Korean translations for every file by default increases token cost.
The MVP should generate English files first and provide Korean translation only when the user clicks Korean Preview.
Cache translated results after first generation.
```

### Setting Group 7 — Package Options

```ts
type PackageOptions = {
  includeSkillMd: boolean;
  includeReadme: boolean;
  includeReferences: boolean;
  includeTemplates: boolean;
  includeExamples: boolean;
  exportFormat: "zip" | "single-md" | "clipboard";
};
```

Recommended default:

```json
{
  "includeSkillMd": true,
  "includeReadme": true,
  "includeReferences": true,
  "includeTemplates": true,
  "includeExamples": true,
  "exportFormat": "zip"
}
```

---

## 8. How Settings Change the Generated Skill

The app should show clear explanations for what each setting changes.

### Example 1 — Cursor Prompt Enabled

If `includeCursorPrompt` is true:

Generate:

```txt
templates/cursor-prompt-template.md
```

Also add Cursor-specific implementation output rules to `SKILL.md`.

### Example 2 — Design System Awareness Enabled

If `designSystemAwareness` is true:

Generate:

```txt
references/design-system-rules.md
templates/design-token-template.md
```

Also add rules about tokens, components, and variants to `SKILL.md`.

### Example 3 — Accessibility Enabled

If `includeAccessibility` is true:

Generate:

```txt
references/accessibility-checklist.md
```

Also add accessibility review steps to the final review section of `SKILL.md`.

### Example 4 — Korean Preview Enabled

If `translationMode` is `on-demand`:

Do not include Korean content in generated files by default.

Instead:

```txt
- Show a Korean Preview tab in the UI.
- Translate the currently selected file only when clicked.
- Cache the translated content.
```

### Example 5 — Concise Answer Style

If `answerStyle` is `concise`:

Add this rule to `SKILL.md`:

```txt
Keep direct chat responses concise. Use detailed structured output only when producing documents, specifications, templates, or implementation prompts.
```

### Example 6 — Detailed Answer Style

If `answerStyle` is `detailed`:

Add this rule:

```txt
Prefer full structured documentation with sections, examples, risks, and implementation notes.
```

---

## 9. Generation Architecture

### Recommended Pipeline

```txt
User Settings
  ↓
SkillConfig JSON
  ↓
Block Resolver
  ↓
Template Renderer
  ↓
Optional AI Polish
  ↓
File Tree Builder
  ↓
Quality Checker
  ↓
Preview / Edit / Regenerate
  ↓
ZIP Export
```

### Important Rule

Do not use AI for everything.

Use deterministic template rendering as much as possible.

AI should be used for:

```txt
- improving the final wording
- generating custom examples
- resolving conflicting settings
- translating selected files
- partially regenerating selected sections
```

Static templates should handle:

```txt
- file structure
- default rules
- predefined workflow modules
- default references
- default templates
```

---

## 10. SkillConfig Data Model

Use a central config object.

```ts
export type SkillConfig = {
  id: string;
  skillName: string;
  packageName: string;
  description: string;

  category: SkillCategory;
  targetAgent: TargetAgent;

  roleProfile: RoleProfileSettings;
  workflowModules: WorkflowModule[];
  outputFormat: OutputFormatSettings;
  qualityRules: QualityRule[];
  language: LanguageSettings;
  packageOptions: PackageOptions;

  customInstructions?: string;
  customExamples?: CustomExample[];

  createdAt: string;
  updatedAt: string;
};

export type SkillCategory =
  | "ux-ui"
  | "product"
  | "frontend"
  | "design-system"
  | "research"
  | "content"
  | "data";

export type TargetAgent =
  | "generic"
  | "claude-code"
  | "cursor"
  | "codex"
  | "windsurf";

export type CustomExample = {
  title: string;
  input: string;
  expectedOutput: string;
};
```

---

## 11. Generated File Model

```ts
export type GeneratedFile = {
  id: string;
  path: string;
  fileName: string;
  language: "markdown" | "json" | "text";
  content: string;
  translatedContent?: string;
  isEdited: boolean;
  isGenerated: boolean;
  generatedFrom: string[];
  lastGeneratedAt: string;
};

export type GeneratedPackage = {
  id: string;
  packageName: string;
  config: SkillConfig;
  files: GeneratedFile[];
  qualityReport: QualityReport;
};
```

---

## 12. Quality Checker

### QualityReport Model

```ts
export type QualityReport = {
  totalScore: number;
  checks: QualityCheck[];
  warnings: string[];
  suggestions: string[];
};

export type QualityCheck = {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail";
  message: string;
};
```

### Required Quality Checks

The app should check:

```txt
- Does SKILL.md have a clear name?
- Does SKILL.md have a useful description?
- Does the skill define when to use it?
- Does the skill define a role?
- Does the skill define workflow steps?
- Does the skill define output formats?
- Does the skill include quality rules?
- Does the skill include what not to do?
- Does the package include README.md?
- Does the package include templates if template options are enabled?
- Does the package include references if reference options are enabled?
- Are there conflicting rules?
```

### Example Warnings

```txt
- The skill description is too generic.
- The workflow has too many modules for a beginner preset.
- Korean translation is enabled by default and may increase token usage.
- Cursor prompt template is enabled, but implementation awareness is disabled.
- Accessibility rules are disabled. Consider enabling them for UX/UI skills.
```

---

## 13. UI Structure

### Main Pages

```txt
/
  Home / Landing

/builder
  Skill Builder Wizard

/builder/preview
  Generated Package Preview

/templates
  Preset Gallery

/settings
  Optional user settings
```

### Builder Layout

Use a 3-column layout on desktop.

```txt
Left Panel:
- Preset selection
- Detailed settings
- Generate button

Center Panel:
- File tree
- Markdown preview
- Raw editor
- Korean preview tab

Right Panel:
- Quality score
- Warnings
- Suggestions
- Export actions
```

On mobile, collapse panels into tabs.

---

## 14. File Preview UX

Each generated file should support:

```txt
- Rendered Markdown view
- Raw Markdown editor
- Korean Preview
- Copy content
- Regenerate file
- Reset file
- Mark as edited
```

### Preview Tabs

```txt
[Preview] [Raw] [Korean] [Diff]
```

For MVP, implement:

```txt
[Preview] [Raw] [Korean]
```

`Diff` can be added later.

### Korean Preview Logic

When the Korean tab is clicked:

1. Check if `translatedContent` exists.
2. If yes, show cached translation.
3. If no, call translation API for only the selected file.
4. Save result in `translatedContent`.
5. Do not include Korean translation in ZIP unless user enables `includeTranslations`.

---

## 15. Partial Regeneration

### Regeneration Levels

Support these actions:

```txt
- Regenerate entire package
- Regenerate selected file
- Regenerate selected section
```

For MVP, implement:

```txt
- Regenerate entire package
- Regenerate selected file
```

### Regenerate Selected File

When regenerating a single file, send:

```txt
- Current SkillConfig
- Target file path
- Current file content
- User edit instruction
- Related file summaries
```

Do not send every generated file unless necessary.

### Partial Regeneration Prompt Shape

```txt
You are regenerating one file inside an AI Agent Skill package.

Package name:
{{packageName}}

Target file:
{{filePath}}

User instruction:
{{instruction}}

Relevant configuration:
{{skillConfigSummary}}

Current file content:
{{currentContent}}

Regenerate only this file.
Preserve the package structure.
Do not modify unrelated files.
Return only the new markdown content.
```

---

## 16. Default Generated Package Content Requirements

### SKILL.md Requirements

`SKILL.md` should include:

```txt
- YAML frontmatter
- Skill name
- Description
- Role
- Core principle
- When to use this skill
- Workflow modes
- Output formats
- Design quality rules
- Implementation rules
- Final review checklist
```

### README.md Requirements

`README.md` should include:

```txt
- What this skill is
- Who it is for
- Package structure
- How to install or use
- How to customize
- Example prompts
```

### References Requirements

References should contain reusable knowledge and checklists.

MVP references:

```txt
references/ux-principles.md
references/ui-patterns.md
references/design-system-rules.md
references/accessibility-checklist.md
```

### Templates Requirements

Templates should be practical and copy-ready.

MVP templates:

```txt
templates/ux-brief-template.md
templates/screen-spec-template.md
templates/cursor-prompt-template.md
templates/design-review-template.md
```

### Examples Requirements

Examples should show realistic input and expected output.

MVP example:

```txt
examples/ux-ui-example.md
```

---

## 17. Block Library Structure

Store predefined blocks in code or database.

### Suggested Folder Structure

```txt
src/
├── app/
├── components/
├── lib/
│   ├── skill-builder/
│   │   ├── blocks/
│   │   │   ├── role-blocks.ts
│   │   │   ├── workflow-blocks.ts
│   │   │   ├── output-blocks.ts
│   │   │   ├── rule-blocks.ts
│   │   │   └── reference-blocks.ts
│   │   ├── templates/
│   │   │   ├── skill-md-template.ts
│   │   │   ├── readme-template.ts
│   │   │   └── package-template.ts
│   │   ├── generate-package.ts
│   │   ├── quality-checker.ts
│   │   ├── translate-file.ts
│   │   └── zip-export.ts
│   └── types/
│       └── skill.ts
```

### Block Type

```ts
export type SkillBlock = {
  id: string;
  category: "role" | "workflow" | "output" | "rule" | "reference" | "template";
  title: string;
  description: string;
  content: string;
  dependencies?: string[];
  conflicts?: string[];
};
```

---

## 18. Recommended Tech Stack

Use a simple stack first.

### Frontend

```txt
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- react-markdown
- Zustand or React state
```

### File Export

```txt
- JSZip
- file-saver or browser download API
```

### Markdown Editor

MVP:

```txt
- Textarea-based editor
```

Later:

```txt
- Monaco Editor
- CodeMirror
```

### Storage

MVP:

```txt
- Local state
- LocalStorage for drafts
```

Later:

```txt
- Supabase projects
- user accounts
- saved package history
```

### AI API

MVP options:

```txt
- Server action or API route for AI polish
- API route for translation
- API route for partial regeneration
```

The first MVP can even work without AI for the initial package by using template rendering only.

---

## 19. Token Cost Strategy

### Do Not

Do not translate every generated file by default.

Do not regenerate the entire package after every small change.

Do not send all references and templates to the model for every request.

### Do

Use static blocks and deterministic rendering.

Only use AI when:

```txt
- user requests custom generation
- user clicks Korean Preview
- user regenerates a selected file
- quality checker needs semantic review
```

### Translation Strategy

Recommended MVP approach:

```txt
English generated files:
- created immediately

Korean translation:
- generated only when Korean tab is clicked
- per selected file only
- cached after generation
```

### Approximate Token Usage

Expected package generation if mostly template-based:

```txt
0 to 2,000 tokens
```

Expected package generation with AI polish:

```txt
5,000 to 15,000 tokens
```

Expected full translation of entire package:

```txt
15,000 to 40,000 tokens
```

Expected selected-file translation:

```txt
1,000 to 6,000 tokens
```

Therefore:

```txt
Default English generation + on-demand Korean translation is recommended.
```

---

## 20. MVP Implementation Priority

### Phase 1 — Static MVP

Build this first:

```txt
- Builder page
- UX/UI default preset
- Detailed settings form
- Deterministic package generation
- File tree preview
- Markdown preview
- Raw markdown editor
- ZIP download
- Quality checker
```

No AI is required for Phase 1.

### Phase 2 — AI Assist

Add:

```txt
- AI polish for SKILL.md
- Korean preview translation
- regenerate selected file
- custom examples generation
```

### Phase 3 — Saved Projects

Add:

```txt
- save generated packages
- user account
- package history
- version history
- diff view
```

### Phase 4 — Multi-Category Expansion

Add:

```txt
- Product Planner
- Frontend Builder
- Design System Generator
- Content Planner
- Research Assistant
```

---

## 21. MVP Acceptance Criteria

The MVP is complete when:

```txt
- User can select the UX/UI Designer preset.
- User can see recommended default settings.
- User can open detailed settings and change values.
- User can generate a package.
- User can see a file tree.
- User can click each file and preview markdown.
- User can edit the raw markdown.
- User can see a quality score.
- User can download a ZIP.
- User can trigger Korean preview for a selected file.
- User can regenerate at least one selected file.
```

If AI integration is not ready, Korean preview and regeneration can be shown as disabled buttons with clear labels.

---

## 22. UX Copy Guidelines

Use clear product copy.

### Hero Copy

```txt
Build AI Agent Skills without writing SKILL.md from scratch.
```

Korean version:

```txt
SKILL.md를 처음부터 쓰지 않고, 업무 흐름에 맞는 AI Agent Skill을 조합하세요.
```

### Builder CTA

```txt
Generate Skill Package
```

Korean:

```txt
Skill 패키지 생성하기
```

### Preview Empty State

```txt
Choose a preset and generate your first skill package.
```

Korean:

```txt
프리셋을 선택하고 첫 Skill 패키지를 생성해보세요.
```

### Korean Preview Tooltip

```txt
Korean preview is generated on demand to reduce token usage.
```

Korean:

```txt
토큰 사용량을 줄이기 위해 한글 미리보기는 필요할 때만 생성됩니다.
```

---

## 23. Visual Direction

Use a practical builder UI, not a flashy landing page.

### Recommended Style

```txt
- clean workspace
- file-tree based interface
- calm neutral background
- clear panels
- strong preview area
- product-builder feeling
```

### Avoid

```txt
- overly decorative AI visuals
- vague futuristic gradients
- too many animations
- generic SaaS hero sections
```

### UI References

Think:

```txt
- VS Code file tree
- Notion document editor
- Figma inspector panel
- Vercel-style clean dashboard
```

---

## 24. Important Implementation Notes

### Do Not Hardcode UX/UI Forever

Even though MVP starts with UX/UI, do not hardcode the app around UX/UI only.

Use:

```ts
category: "ux-ui"
```

and category-based block resolution.

### Do Not Make Download the Only Output

The preview/editor experience is part of the product.

The user should understand and adjust the generated files before download.

### Do Not Overuse AI

The product should feel fast and reliable.

AI should enhance, translate, and regenerate, not be required for every small operation.

### Do Not Generate Korean by Default

Korean translation is useful, but full package translation can become expensive.

Use on-demand translation and caching.

---

## 25. First Development Task List

Start with these tasks in order:

```txt
1. Create Next.js project structure.
2. Build static data model for SkillConfig.
3. Create UX/UI default preset.
4. Create block library files.
5. Implement generatePackage(config).
6. Implement file tree UI.
7. Implement markdown preview.
8. Implement raw markdown editor.
9. Implement quality checker.
10. Implement ZIP export.
11. Add Korean preview button as disabled or mock.
12. Add regenerate selected file button as disabled or mock.
13. Polish UI layout.
```

After static MVP works:

```txt
14. Add AI API route for Korean translation.
15. Add AI API route for selected file regeneration.
16. Add draft save to localStorage.
17. Add package version history.
```

---

## 26. Cursor / Claude Code Implementation Prompt

Use this prompt when implementing the MVP:

```txt
Build a Next.js + TypeScript + Tailwind web app called AxDD Skill Builder.

The app helps users generate AI Agent Skill packages. The first MVP supports only the UX/UI Designer category, but the internal data model must support future categories.

Core requirements:
1. Create a builder page with a UX/UI Designer default preset.
2. Show recommended default settings.
3. Allow users to open detailed settings and modify:
   - skill name
   - target agent
   - role level
   - workflow modules
   - output modules
   - quality rules
   - language settings
   - package options
4. Generate a package from selected blocks.
5. Display generated files in a file tree.
6. Allow users to click each file and preview markdown.
7. Provide raw markdown editing.
8. Provide a quality score panel.
9. Provide ZIP download using JSZip.
10. Build the architecture using reusable skill blocks, not hardcoded one-off strings.
11. Add placeholders for Korean Preview and Regenerate File. These can be mocked first.
12. Keep UI clean, practical, and workspace-like.

Recommended stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui if available
- react-markdown
- JSZip

Important:
- Do not use AI for the first static MVP.
- Use deterministic template generation first.
- Design the data model so that Product, Frontend, Design System, Research, and Content categories can be added later.
```

---

## 27. Final Product Direction

The MVP should prove this idea:

```txt
A user can create a useful AI Agent Skill package without manually writing SKILL.md.
```

The long-term product should become:

```txt
A workspace for designing, editing, testing, translating, versioning, and exporting AI Agent Skills.
```

Do not position this as a simple Markdown generator.

Position it as:

```txt
A workflow builder for AI Agent behavior.
```
