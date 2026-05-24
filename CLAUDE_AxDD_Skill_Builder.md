# CLAUDE.md

# AxDD Skill Builder — MVP Implementation Guide

This file defines the product direction, MVP scope, generation logic, UX structure, data model, and implementation rules for building **AxDD Skill Builder**.

The goal is to create a web application that lets users compose, preview, edit, regenerate, and download **AXDD Standard Kit packages** — not just a single `SKILL.md` file, but a full structured kit that bundles SKILL.md, CATALOG.md, README.md, WORK_UNIT.json, HOOKS.json, and supporting reference / template / checklist / test / example folders.

The first MVP ships the **AXDD UX/UI Standard Kit** as the default preset, with a data model that supports 8 distinct skill package types and additional categories later.

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

AxDD Skill Builder helps designers and makers compose **AXDD Standard Kit packages** — structured AI Agent skill kits that bundle workflow definitions, hooks, catalogs, references, templates, checklists, and tests — through a guided web interface.

### Core Concept

The service is **not** a single-file `SKILL.md` generator.

It is an **AXDD Standard Kit composer**:

1. The user selects a purpose and a package type.
2. The user chooses recommended or detailed settings.
3. The system generates a structured kit (SKILL.md + CATALOG.md + README.md + WORK_UNIT.json + HOOKS.json + folders).
4. The user can preview each generated file in the browser.
5. The user can edit or partially regenerate files.
6. The user can download the result as a ZIP package.

---

## 2. MVP Scope

### Initial MVP Focus

The first MVP ships:

```txt
AXDD UX/UI Standard Kit (default preset)
```

This default preset is treated as:

```txt
category:     ux-ui
packageType:  full-step-skill
name:         AXDD UX/UI Standard Kit
```

Do not try to support every possible skill category in the first version, but design the data model so additional categories and package types can be added without refactoring.

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

## 3. Skill Package Types (8 Types)

Every generated kit declares a `packageType`. The MVP must support **8 package types** in its data model. The default UX/UI preset uses `full-step-skill`.

```ts
export type SkillPackageType =
  | "simple-skill"      // single SKILL.md only, minimal scaffolding
  | "reference-skill"   // SKILL.md + references/ knowledge base
  | "template-skill"    // SKILL.md + templates/ copy-ready artifacts
  | "script-skill"      // SKILL.md + executable scripts / commands
  | "asset-skill"       // SKILL.md + binary or static assets bundle
  | "full-step-skill"   // full multi-step workflow kit (WORK_UNIT + HOOKS + all folders)
  | "metadata-skill"    // SKILL.md + machine-readable metadata only (no prose templates)
  | "test-skill";       // SKILL.md + tests/ sandbox scenarios and validation logs
```

### Type → Required Files Matrix

| Package Type      | SKILL.md | CATALOG.md | README.md | WORK_UNIT.json | HOOKS.json | references/ | templates/ | checklists/ | tests/ | examples/ |
|-------------------|:--------:|:----------:|:---------:|:--------------:|:----------:|:-----------:|:----------:|:-----------:|:------:|:---------:|
| simple-skill      | ✅       |            | ✅        |                |            |             |            |             |        |           |
| reference-skill   | ✅       | ✅         | ✅        |                |            | ✅          |            |             |        |           |
| template-skill    | ✅       | ✅         | ✅        |                |            |             | ✅         |             |        | ✅        |
| script-skill      | ✅       | ✅         | ✅        |                | ✅         |             |            |             |        | ✅        |
| asset-skill       | ✅       | ✅         | ✅        |                |            |             |            |             |        | ✅        |
| full-step-skill   | ✅       | ✅         | ✅        | ✅             | ✅         | ✅          | ✅         | ✅          | ✅     | ✅        |
| metadata-skill    | ✅       | ✅         |           |                | ✅         |             |            |             |        |           |
| test-skill        | ✅       | ✅         | ✅        |                |            |             |            | ✅          | ✅     |           |

The MVP must implement generators for all 8 types in the data model, but the default UX/UI preset exercises the **full-step-skill** path end to end.

---

## 4. Main User Flow

```txt
Home
  ↓
Choose Category + Package Type (default: UX/UI + full-step-skill)
  ↓
Select Default Preset or Customize
  ↓
Configure Detailed Settings
  ↓
Generate AXDD Standard Kit
  ↓
Preview File Tree (SKILL.md, CATALOG.md, README.md, WORK_UNIT.json, HOOKS.json, folders)
  ↓
Edit / Regenerate
  ↓
Download ZIP
```

### MVP User Journey

1. User enters the builder.
2. The default category is `UX/UI Designer`, default packageType is `full-step-skill`, default kit name is `AXDD UX/UI Standard Kit`.
3. The system shows recommended default settings.
4. User can either use recommended settings immediately, or open detailed settings and customize.
5. User clicks `Generate Kit`.
6. The app creates the full file tree described in section 7.
7. User clicks each file to preview it (rendered markdown for `.md`, formatted JSON for `.json`).
8. User can edit a file directly.
9. User can regenerate the selected file.
10. User can download the final kit as a ZIP.

---

## 5. Product Principles

### Principle 1 — Static and Deterministic First

The MVP must be **fully static and deterministic**. **Do not integrate any AI API in the MVP.** All files are produced by template rendering from `SkillConfig`. AI-based polish, translation, and partial regeneration are deferred to a later phase.

### Principle 2 — Block-Based Generation

Use reusable blocks (role, workflow, output, rule, template, reference, hook, catalog-entry) and compose them into final files.

### Principle 3 — Defaults First, Detail Later

The default experience should be:

```txt
Open Builder → Generate AXDD UX/UI Standard Kit → Preview → Download
```

Detailed customization is available but not required.

### Principle 4 — Preview Before Download

The generated kit must be fully visible in the browser through a file tree before download.

### Principle 5 — Partial Regeneration

Support regeneration at: whole package, one file, one section. MVP implements whole-package and per-file regeneration deterministically.

### Principle 6 — English First

Generated kits use English as the primary language. Korean preview / translation is deferred to a later phase (no AI in MVP).

---

## 6. Recommended Default Preset

### Default Preset

```txt
Name:        AXDD UX/UI Standard Kit
Category:    ux-ui
PackageType: full-step-skill
```

### Default Purpose

```txt
Compose an AXDD Standard Kit that turns product ideas, rough requirements, screenshots, or feature requests into a structured UX/UI workflow — from requirement intake through handoff — with reusable references, templates, checklists, and validation tests.
```

### Default Role

```txt
Senior UX/UI Designer with frontend implementation awareness.
```

### Default Workflow (see WORK_UNIT.json in section 10)

```txt
Requirement Intake
  → UX Foundation
  → UI Design Foundation
  → Prototype Planning
  → Review & Validation
  → Handoff
```

### Default Rules

```txt
- Do not jump directly into visual styling.
- Do not use vague words like modern, clean, intuitive, or premium without concrete design rules.
- Always define the primary user action.
- Always include information hierarchy.
- Always break screens into reusable components.
- Always consider default, empty, loading, and error states.
- Always include implementation notes when producing UI specs.
- Keep chat answers concise unless the user asks for detailed documentation.
- Prefer Figma MCP when available, but always provide a manual-instruction fallback for enterprise environments where MCP is blocked.
```

---

## 7. Default Generated Kit Structure

The default `AXDD UX/UI Standard Kit` (full-step-skill) generates this tree:

```txt
axdd-ux-ui-standard-kit/
├── SKILL.md
├── CATALOG.md
├── README.md
├── WORK_UNIT.json
├── HOOKS.json
├── references/
│   ├── ux-principles.md
│   ├── ui-patterns.md
│   ├── design-system-rules.md
│   └── accessibility-checklist.md
├── templates/
│   ├── ux-brief-template.md
│   ├── screen-spec-template.md
│   ├── design-review-template.md
│   ├── cursor-prompt-template.md
│   └── figma-instruction-template.md
├── checklists/
│   ├── ux-foundation-checklist.md
│   ├── ui-design-checklist.md
│   ├── handoff-checklist.md
│   └── release-checklist.md
├── tests/
│   ├── sandbox-test-scenario.md
│   └── validation-log-template.md
└── examples/
    └── ux-ui-example.md
```

Every file in this tree is produced deterministically from templates in the MVP.

---

## 8. SKILL.md — Top-Level Kit Manifest

`SKILL.md` should include:

```txt
- YAML frontmatter (name, category, packageType, version, primaryLanguage)
- Kit name and one-line description
- Role
- Core principle
- When to use this kit
- Workflow overview (mirrors WORK_UNIT.json stages)
- Output formats
- Design quality rules
- Implementation rules
- Pointer to CATALOG.md, WORK_UNIT.json, HOOKS.json
- Final review checklist
```

---

## 9. CATALOG.md — Inventory of Bundled Skills

`CATALOG.md` is a new required file (for every package type except `simple-skill`). It enumerates each included skill / artifact in the kit so an agent or a human can scan the kit without opening every file.

### Required Sections

```txt
- Kit identity (name, category, packageType, version)
- Table of contents grouped by folder (references, templates, checklists, tests, examples)
- For each entry:
    * Title
    * When to use it
    * Inputs it expects
    * Outputs it produces
    * Related files (cross-links inside the kit)
```

### Default CATALOG.md Entries (UX/UI Standard Kit)

The deterministic generator must populate at least these entries:

```txt
references/ux-principles.md
references/ui-patterns.md
references/design-system-rules.md
references/accessibility-checklist.md

templates/ux-brief-template.md
templates/screen-spec-template.md
templates/design-review-template.md
templates/cursor-prompt-template.md
templates/figma-instruction-template.md

checklists/ux-foundation-checklist.md
checklists/ui-design-checklist.md
checklists/handoff-checklist.md
checklists/release-checklist.md

tests/sandbox-test-scenario.md
tests/validation-log-template.md

examples/ux-ui-example.md
```

Each entry follows the same row schema (title / when to use / inputs / outputs / related files).

---

## 10. WORK_UNIT.json — Composed Workflow Definition

`WORK_UNIT.json` declares the ordered workflow the kit executes. For the default UX/UI Standard Kit it must encode the 6-stage workflow:

```txt
Requirement Intake → UX Foundation → UI Design Foundation → Prototype Planning → Review & Validation → Handoff
```

### Schema

```ts
export type WorkUnit = {
  kitName: string;
  category: SkillCategory;
  packageType: SkillPackageType;
  stages: WorkStage[];
};

export type WorkStage = {
  id: string;                  // e.g. "requirement-intake"
  title: string;               // e.g. "Requirement Intake"
  order: number;
  purpose: string;
  inputs: string[];
  outputs: string[];
  usesTemplates: string[];     // file paths inside templates/
  usesReferences: string[];    // file paths inside references/
  usesChecklists: string[];    // file paths inside checklists/
  exitCriteria: string[];      // what must be true to advance
};
```

### Default WORK_UNIT.json (UX/UI Standard Kit)

```json
{
  "kitName": "AXDD UX/UI Standard Kit",
  "category": "ux-ui",
  "packageType": "full-step-skill",
  "stages": [
    {
      "id": "requirement-intake",
      "title": "Requirement Intake",
      "order": 1,
      "purpose": "Capture the product idea, constraints, target users, and success signals before any design work begins.",
      "inputs": ["raw product idea", "stakeholder notes", "existing screenshots (optional)"],
      "outputs": ["UX brief draft"],
      "usesTemplates": ["templates/ux-brief-template.md"],
      "usesReferences": [],
      "usesChecklists": [],
      "exitCriteria": ["primary user, primary action, and success metric are explicitly named"]
    },
    {
      "id": "ux-foundation",
      "title": "UX Foundation",
      "order": 2,
      "purpose": "Establish user flows, information architecture, and screen inventory.",
      "inputs": ["UX brief"],
      "outputs": ["user flow", "screen inventory", "IA outline"],
      "usesTemplates": ["templates/ux-brief-template.md"],
      "usesReferences": ["references/ux-principles.md"],
      "usesChecklists": ["checklists/ux-foundation-checklist.md"],
      "exitCriteria": ["each screen has a defined purpose and a primary action"]
    },
    {
      "id": "ui-design-foundation",
      "title": "UI Design Foundation",
      "order": 3,
      "purpose": "Define layout, hierarchy, components, and design-system-aware specifications per screen.",
      "inputs": ["screen inventory"],
      "outputs": ["screen specifications", "component breakdown", "design token draft"],
      "usesTemplates": ["templates/screen-spec-template.md"],
      "usesReferences": ["references/ui-patterns.md", "references/design-system-rules.md"],
      "usesChecklists": ["checklists/ui-design-checklist.md"],
      "exitCriteria": ["every screen lists default / empty / loading / error states"]
    },
    {
      "id": "prototype-planning",
      "title": "Prototype Planning",
      "order": 4,
      "purpose": "Plan the prototype build, prefer Figma MCP, and prepare manual Figma instructions when MCP is blocked.",
      "inputs": ["screen specifications", "component breakdown"],
      "outputs": ["prototype plan", "Figma manual instructions"],
      "usesTemplates": ["templates/figma-instruction-template.md", "templates/cursor-prompt-template.md"],
      "usesReferences": [],
      "usesChecklists": [],
      "exitCriteria": ["a buildable plan exists for both MCP and manual paths"]
    },
    {
      "id": "review-validation",
      "title": "Review & Validation",
      "order": 5,
      "purpose": "Run UX/UI review, accessibility checks, and sandbox validation before handoff.",
      "inputs": ["screen specifications", "prototype plan"],
      "outputs": ["review notes", "validation log"],
      "usesTemplates": ["templates/design-review-template.md"],
      "usesReferences": ["references/accessibility-checklist.md"],
      "usesChecklists": ["checklists/ui-design-checklist.md"],
      "exitCriteria": ["all blocking issues from sandbox-test-scenario are resolved or accepted"]
    },
    {
      "id": "handoff",
      "title": "Handoff",
      "order": 6,
      "purpose": "Produce implementation-ready artifacts and release the kit output to engineering.",
      "inputs": ["screen specifications", "review notes", "validation log"],
      "outputs": ["implementation prompt", "handoff package"],
      "usesTemplates": ["templates/cursor-prompt-template.md"],
      "usesReferences": [],
      "usesChecklists": ["checklists/handoff-checklist.md", "checklists/release-checklist.md"],
      "exitCriteria": ["release-checklist is fully ticked"]
    }
  ]
}
```

---

## 11. HOOKS.json — Trigger Definitions

`HOOKS.json` declares keyword / intent triggers that route incoming user requests to a specific skill, template, or workflow stage inside the kit. This lets an AI agent pick the right artifact from the catalog without scanning every file.

### Schema

```ts
export type HooksFile = {
  kitName: string;
  hooks: Hook[];
};

export type Hook = {
  id: string;
  triggerType: "keyword" | "intent";
  triggers: string[];            // keywords or intent phrases (lowercased)
  routeTo: {
    stage?: string;              // WorkStage.id
    template?: string;           // path inside templates/
    reference?: string;          // path inside references/
    checklist?: string;          // path inside checklists/
  };
  description: string;
};
```

### Default HOOKS.json (UX/UI Standard Kit)

```json
{
  "kitName": "AXDD UX/UI Standard Kit",
  "hooks": [
    {
      "id": "hook-intake",
      "triggerType": "keyword",
      "triggers": ["new idea", "rough requirement", "kickoff", "brief"],
      "routeTo": { "stage": "requirement-intake", "template": "templates/ux-brief-template.md" },
      "description": "Route fresh product ideas into Requirement Intake."
    },
    {
      "id": "hook-flow",
      "triggerType": "intent",
      "triggers": ["design user flow", "information architecture", "screen inventory"],
      "routeTo": { "stage": "ux-foundation", "reference": "references/ux-principles.md" },
      "description": "Route flow / IA requests into UX Foundation."
    },
    {
      "id": "hook-screen",
      "triggerType": "intent",
      "triggers": ["design this screen", "screen spec", "component breakdown"],
      "routeTo": { "stage": "ui-design-foundation", "template": "templates/screen-spec-template.md" },
      "description": "Route per-screen design requests into UI Design Foundation."
    },
    {
      "id": "hook-figma-mcp-blocked",
      "triggerType": "keyword",
      "triggers": ["figma blocked", "no figma mcp", "enterprise figma", "manual figma"],
      "routeTo": { "stage": "prototype-planning", "template": "templates/figma-instruction-template.md" },
      "description": "Fallback to manual Figma instructions when Figma MCP is unavailable."
    },
    {
      "id": "hook-review",
      "triggerType": "keyword",
      "triggers": ["review", "accessibility", "a11y", "validate"],
      "routeTo": { "stage": "review-validation", "template": "templates/design-review-template.md" },
      "description": "Route review and accessibility requests into Review & Validation."
    },
    {
      "id": "hook-handoff",
      "triggerType": "keyword",
      "triggers": ["handoff", "implementation prompt", "ship", "release"],
      "routeTo": { "stage": "handoff", "checklist": "checklists/release-checklist.md" },
      "description": "Route handoff and release requests into Handoff."
    }
  ]
}
```

---

## 12. Figma Manual Instruction Template (Enterprise Fallback)

Figma MCP may be blocked in enterprise environments. Every full-step-skill UX/UI kit must ship a manual-instruction fallback.

### File

```txt
templates/figma-instruction-template.md
```

### Required Sections

```txt
- When to use this template (Figma MCP unavailable / blocked by enterprise policy)
- Prerequisites (Figma file URL, page name, frame naming convention)
- Step-by-step manual instructions for the designer:
    1. Create page / frame
    2. Apply layout grid
    3. Place components from the design system
    4. Apply tokens
    5. Mark states (default / empty / loading / error)
    6. Export specs
- Checklist to confirm parity with the screen specification
- Notes on how to feed the manual output back into the workflow
```

---

## 13. Validation & Governance Templates

These three files are required for the default UX/UI Standard Kit and for any `test-skill` package.

### tests/sandbox-test-scenario.md

```txt
- Purpose: define repeatable sandbox scenarios used to validate the kit's output before release.
- Required sections:
    * Scenario ID
    * Input (raw prompt or brief)
    * Expected stage routing (which WORK_UNIT stage should fire)
    * Expected artifacts produced
    * Pass / fail criteria
```

### tests/validation-log-template.md

```txt
- Purpose: record each validation run.
- Required columns / fields:
    * Run date
    * Kit version
    * Scenario ID
    * Result (pass / warn / fail)
    * Notes
    * Follow-up actions
```

### checklists/release-checklist.md

```txt
- Purpose: gate the Handoff stage before the kit (or its output) is released.
- Required items:
    * All WORK_UNIT exit criteria met
    * All sandbox scenarios pass or have accepted exceptions
    * CATALOG.md is up to date with every file in the kit
    * HOOKS.json triggers are reviewed for collisions
    * Version bumped in SKILL.md frontmatter
    * README.md install / usage section reflects current structure
```

---

## 14. Detailed Settings Structure

### Setting Group 1 — Basic Info

```ts
type BasicInfoSettings = {
  kitName: string;
  packageName: string;
  description: string;
  category: SkillCategory;
  packageType: SkillPackageType;
  targetAgent: "generic" | "claude-code" | "cursor" | "codex" | "windsurf";
};
```

Recommended default:

```json
{
  "kitName": "AXDD UX/UI Standard Kit",
  "packageName": "axdd-ux-ui-standard-kit",
  "description": "AXDD Standard Kit for AI-assisted UX/UI design workflows.",
  "category": "ux-ui",
  "packageType": "full-step-skill",
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

### Setting Group 3 — Workflow Stages

The MVP workflow stages map 1:1 to `WORK_UNIT.json`:

```ts
type WorkflowStageId =
  | "requirement-intake"
  | "ux-foundation"
  | "ui-design-foundation"
  | "prototype-planning"
  | "review-validation"
  | "handoff";
```

Recommended default: all six, in order.

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
  includeFigmaManualFallback: boolean;
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
  "includeExamples": true,
  "includeFigmaManualFallback": true
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
  | "avoid-overlong-chat-response"
  | "always-provide-figma-manual-fallback";
```

Recommended default: enable all of the above.

### Setting Group 6 — Language Settings

```ts
type LanguageSettings = {
  primaryLanguage: "en" | "ko";
};
```

Recommended default: `{ "primaryLanguage": "en" }`. Korean translation is out of scope for the MVP because it would require an AI API.

### Setting Group 7 — Package Options

```ts
type PackageOptions = {
  includeSkillMd: boolean;       // always true
  includeCatalogMd: boolean;
  includeReadme: boolean;
  includeWorkUnitJson: boolean;
  includeHooksJson: boolean;
  includeReferences: boolean;
  includeTemplates: boolean;
  includeChecklists: boolean;
  includeTests: boolean;
  includeExamples: boolean;
  exportFormat: "zip" | "single-md" | "clipboard";
};
```

Recommended default for the UX/UI Standard Kit: every flag `true`, `exportFormat: "zip"`.

The package-type matrix in section 3 supersedes individual flags: if a flag conflicts with the selected `packageType` requirements, the matrix wins.

---

## 15. Generation Architecture

### Pipeline (Static, No AI in MVP)

```txt
User Settings
  ↓
SkillConfig JSON
  ↓
Package Type Resolver  (apply matrix from section 3)
  ↓
Block Resolver
  ↓
Template Renderer  (deterministic)
  ↓
File Tree Builder  (SKILL.md + CATALOG.md + README.md + WORK_UNIT.json + HOOKS.json + folders)
  ↓
Quality Checker
  ↓
Preview / Edit / Regenerate (deterministic re-render)
  ↓
ZIP Export
```

### Hard Rule for MVP

**Do not call any AI API in the MVP.** All generation, regeneration, and validation must be deterministic template rendering. AI-based polish, translation, and intelligent regeneration are explicitly deferred to a later phase.

---

## 16. SkillConfig Data Model

```ts
export type SkillConfig = {
  id: string;
  kitName: string;
  packageName: string;
  description: string;

  category: SkillCategory;
  packageType: SkillPackageType;
  targetAgent: TargetAgent;

  roleProfile: RoleProfileSettings;
  workflowStages: WorkflowStageId[];
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

## 17. Generated File Model

```ts
export type GeneratedFile = {
  id: string;
  path: string;                 // e.g. "checklists/release-checklist.md"
  fileName: string;
  language: "markdown" | "json" | "text";
  content: string;
  isEdited: boolean;
  isGenerated: boolean;
  generatedFrom: string[];      // block / template IDs
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

## 18. Quality Checker

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

```txt
- Does SKILL.md have a clear name and description?
- Does SKILL.md declare category and packageType in frontmatter?
- Does CATALOG.md list every file present in the kit?
- Does WORK_UNIT.json include all 6 default stages (for UX/UI full-step-skill)?
- Does every WorkStage reference templates / references / checklists that actually exist in the kit?
- Does HOOKS.json route to valid stage IDs and existing files?
- Are there hook trigger collisions (same keyword routing to multiple hooks)?
- Does the kit include the Figma manual fallback when category is ux-ui?
- Does tests/ include sandbox-test-scenario.md and validation-log-template.md (for full-step-skill / test-skill)?
- Does checklists/ include release-checklist.md (for full-step-skill)?
- Are the files required by the selected packageType (section 3 matrix) all present?
```

---

## 19. UI Structure

### Main Pages

```txt
/                  Home / Landing
/builder           Kit Builder Wizard
/builder/preview   Generated Kit Preview
/templates         Preset Gallery
/settings          Optional user settings
```

### Builder Layout (Desktop, 3 columns)

```txt
Left Panel:
- Category + Package Type selector  (default: ux-ui + full-step-skill)
- Preset selection
- Detailed settings
- Generate button

Center Panel:
- File tree (includes SKILL.md, CATALOG.md, README.md, WORK_UNIT.json, HOOKS.json + folders)
- Markdown preview / JSON preview
- Raw editor

Right Panel:
- Quality score
- Warnings (e.g. "WORK_UNIT references missing template")
- Suggestions
- Export actions
```

On mobile, collapse panels into tabs.

---

## 20. File Preview UX

Each generated file supports:

```txt
- Rendered Markdown view (for .md)
- Pretty-printed JSON view (for WORK_UNIT.json, HOOKS.json)
- Raw editor
- Copy content
- Regenerate file (deterministic re-render from current SkillConfig)
- Reset file
- Mark as edited
```

For MVP, implement the following tabs:

```txt
[Preview] [Raw]
```

Korean preview and diff are deferred.

---

## 21. Partial Regeneration (Deterministic Only)

```txt
- Regenerate entire kit
- Regenerate selected file
```

Both are deterministic re-renders from `SkillConfig` plus the package-type matrix. No AI call.

---

## 22. Block Library Structure

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
│   │   │   ├── reference-blocks.ts
│   │   │   ├── template-blocks.ts
│   │   │   ├── checklist-blocks.ts
│   │   │   ├── test-blocks.ts
│   │   │   ├── catalog-blocks.ts
│   │   │   └── hook-blocks.ts
│   │   ├── templates/
│   │   │   ├── skill-md-template.ts
│   │   │   ├── catalog-md-template.ts
│   │   │   ├── readme-template.ts
│   │   │   ├── work-unit-template.ts
│   │   │   ├── hooks-template.ts
│   │   │   └── figma-instruction-template.ts
│   │   ├── package-types/
│   │   │   ├── simple-skill.ts
│   │   │   ├── reference-skill.ts
│   │   │   ├── template-skill.ts
│   │   │   ├── script-skill.ts
│   │   │   ├── asset-skill.ts
│   │   │   ├── full-step-skill.ts
│   │   │   ├── metadata-skill.ts
│   │   │   └── test-skill.ts
│   │   ├── generate-package.ts
│   │   ├── quality-checker.ts
│   │   └── zip-export.ts
│   └── types/
│       └── skill.ts
```

### Block Type

```ts
export type SkillBlock = {
  id: string;
  category:
    | "role"
    | "workflow"
    | "output"
    | "rule"
    | "reference"
    | "template"
    | "checklist"
    | "test"
    | "catalog"
    | "hook";
  title: string;
  description: string;
  content: string;
  dependencies?: string[];
  conflicts?: string[];
};
```

---

## 23. Recommended Tech Stack

```txt
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- react-markdown (markdown preview)
- JSZip + browser download API (export)
- Textarea-based editor (Monaco / CodeMirror later)
- Local state + LocalStorage (drafts)
```

No AI SDK is required for the MVP.

---

## 24. MVP Implementation Priority

### Phase 1 — Static MVP (current scope)

```txt
- Builder page with Category + Package Type selectors (default ux-ui / full-step-skill)
- AXDD UX/UI Standard Kit default preset
- Detailed settings form
- Deterministic kit generation for all 8 package types (matrix-driven)
- SKILL.md, CATALOG.md, README.md, WORK_UNIT.json, HOOKS.json generators
- references/, templates/ (incl. figma-instruction-template.md), checklists/ (incl. release-checklist.md), tests/ (sandbox-test-scenario.md, validation-log-template.md), examples/
- File tree preview (markdown + JSON)
- Raw editor
- Deterministic per-file and whole-kit regeneration
- Quality checker
- ZIP download
```

**No AI calls in Phase 1.**

### Phase 2 — AI Assist (deferred)

```txt
- AI polish for SKILL.md
- Korean preview translation
- Intelligent regenerate selected file
- Custom examples generation
```

### Phase 3 — Saved Projects (deferred)

```txt
- Save generated kits
- User accounts
- Kit history and version history
- Diff view
```

### Phase 4 — Multi-Category Expansion (deferred)

```txt
- Product Planner
- Frontend Builder
- Design System Generator
- Content Planner
- Research Assistant
```

---

## 25. MVP Acceptance Criteria

The MVP is complete when:

```txt
- User can select category = ux-ui and packageType = full-step-skill (the default).
- User can see recommended default settings for AXDD UX/UI Standard Kit.
- User can open detailed settings and change values.
- User can generate the kit.
- File tree contains SKILL.md, CATALOG.md, README.md, WORK_UNIT.json, HOOKS.json, references/, templates/, checklists/, tests/, examples/.
- WORK_UNIT.json contains the 6 stages: Requirement Intake, UX Foundation, UI Design Foundation, Prototype Planning, Review & Validation, Handoff.
- HOOKS.json contains at least the 6 default hooks (intake, flow, screen, figma-mcp-blocked, review, handoff).
- templates/figma-instruction-template.md, tests/sandbox-test-scenario.md, tests/validation-log-template.md, checklists/release-checklist.md are all present and non-empty.
- User can click each file and preview markdown or JSON.
- User can edit the raw content.
- User can regenerate any single file or the whole kit deterministically (no AI call).
- User can see a quality score and see warnings when CATALOG / WORK_UNIT / HOOKS reference missing files.
- User can download a ZIP of the kit.
- The data model supports all 8 package types (simple, reference, template, script, asset, full-step, metadata, test), even if the default UI only exposes ux-ui + full-step-skill.
```

---

## 26. UX Copy Guidelines

### Hero Copy

```txt
Compose AXDD Standard Kits without writing SKILL.md, CATALOG.md, WORK_UNIT.json, and HOOKS.json from scratch.
```

Korean version:

```txt
SKILL.md, CATALOG.md, WORK_UNIT.json, HOOKS.json을 직접 작성하지 않고 AXDD Standard Kit를 조합하세요.
```

### Builder CTA

```txt
Generate AXDD Standard Kit
```

Korean:

```txt
AXDD Standard Kit 생성하기
```

### Preview Empty State

```txt
Choose a category and package type, then generate your first AXDD Standard Kit.
```

Korean:

```txt
카테고리와 패키지 타입을 선택하고 첫 AXDD Standard Kit를 생성해보세요.
```

---

## 27. Visual Direction

```txt
- Clean workspace
- File-tree based interface
- Calm neutral background
- Clear panels
- Strong preview area
- Product-builder feeling
```

Avoid:

```txt
- Overly decorative AI visuals
- Vague futuristic gradients
- Too many animations
- Generic SaaS hero sections
```

UI references: VS Code file tree, Notion document editor, Figma inspector panel, Vercel-style clean dashboard.

---

## 28. Important Implementation Notes

### Do Not Hardcode UX/UI Forever

Even though the MVP defaults to UX/UI, do not hardcode the app around UX/UI only. Use `category` + `packageType` and matrix-based file resolution.

### Do Not Make Download the Only Output

The preview/editor experience is part of the product. Users must understand and adjust the generated files before download.

### Do Not Integrate AI in the MVP

The first release must be **fully static and deterministic**. Every file in the kit is produced by template rendering. AI integration is a Phase 2 concern.

### Always Ship the Figma Manual Fallback for UX/UI Kits

Enterprise environments frequently block Figma MCP. `templates/figma-instruction-template.md` is mandatory for the default UX/UI Standard Kit.

---

## 29. First Development Task List

```txt
1. Create Next.js project structure.
2. Build static data model for SkillConfig, including SkillPackageType (8 types).
3. Implement package-type → required-files matrix (section 3).
4. Create AXDD UX/UI Standard Kit default preset (full-step-skill).
5. Build block libraries (role, workflow, output, rule, reference, template, checklist, test, catalog, hook).
6. Implement deterministic template renderers for:
     - SKILL.md
     - CATALOG.md
     - README.md
     - WORK_UNIT.json (6 stages)
     - HOOKS.json (6 default hooks)
     - templates/figma-instruction-template.md
     - tests/sandbox-test-scenario.md
     - tests/validation-log-template.md
     - checklists/release-checklist.md
7. Implement generatePackage(config) honoring the package-type matrix.
8. Implement file tree UI (markdown + JSON preview).
9. Implement raw editor.
10. Implement deterministic per-file and whole-kit regeneration.
11. Implement quality checker (cross-reference CATALOG / WORK_UNIT / HOOKS against present files).
12. Implement ZIP export.
13. Polish UI layout.
```

Phase 2 and later (AI polish, Korean preview, saved projects, multi-category) are out of scope for the MVP.

---

## 30. Final Product Direction

The MVP should prove this idea:

```txt
A user can compose a useful AXDD Standard Kit — SKILL.md + CATALOG.md + README.md + WORK_UNIT.json + HOOKS.json + references/templates/checklists/tests/examples — without writing any of those files by hand, and without any AI API call.
```

The long-term product becomes:

```txt
A workspace for designing, editing, testing, validating, versioning, and exporting AXDD Standard Kits across multiple categories and all 8 package types.
```

Position this product as:

```txt
A workflow builder for AI Agent behavior — an AXDD Standard Kit composer, not a Markdown generator.
```
