# AxDD Skill Builder — Static MVP

A Next.js web app that lets you compose, preview, edit, and download AI Agent Skill
packages. This MVP supports only the **UX/UI Designer** category and uses a fully
deterministic, template-based generator — no AI required.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## What works in the MVP

- Builder page at `/builder` with a 3-column workspace layout (left: settings, center: file tree + preview, right: quality + export).
- **UX/UI Designer — AxDD Default** preset is fully wired; the other three presets appear as disabled "coming soon" cards.
- Detailed settings cover the 7 setting groups from the spec: basic info, role profile, workflow modules, output format, quality rules, language, package options.
- Deterministic `generatePackage(config)` produces `SKILL.md`, `README.md`, `references/`, `templates/`, and `examples/` based on toggles.
- File tree preview with file selection.
- Markdown rendered preview (react-markdown + GFM) and raw markdown editor.
- Edited files are marked with a dot in the file tree.
- Per-file **Regenerate File** deterministically rebuilds only the selected file.
- Quality score panel with passes / warnings / suggestions.
- ZIP download via JSZip + file-saver.
- **Korean Preview** tab and footer button are present but disabled / placeholder, with a clear note that they unlock in Phase 2 (AI Assist).

## Architecture

The internal model is category-based so future skill categories (Product Planner,
Frontend Implementation, Design System Generator, etc.) can be added without UI
rewrites.

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              landing
│   └── builder/page.tsx      3-column builder workspace
├── components/builder/
│   ├── SettingsForm.tsx
│   ├── FileTree.tsx
│   ├── MarkdownPreview.tsx
│   ├── RawEditor.tsx
│   ├── QualityPanel.tsx
│   └── PresetCard.tsx
├── lib/skill-builder/
│   ├── categories.ts         category registry (ux-ui available, rest coming-soon)
│   ├── default-preset.ts     PRESETS + buildUxUiDefaultConfig()
│   ├── generate-package.ts   generatePackage(config), regenerateFile(...)
│   ├── quality-checker.ts    runQualityChecks(config, files)
│   ├── zip-export.ts         downloadPackageAsZip(pkg)
│   ├── blocks/
│   │   ├── role-blocks.ts
│   │   ├── workflow-blocks.ts
│   │   ├── output-blocks.ts
│   │   ├── rule-blocks.ts
│   │   └── reference-blocks.ts
│   └── templates/
│       ├── skill-md-template.ts
│       ├── readme-template.ts
│       ├── references-templates.ts
│       ├── templates-templates.ts
│       └── examples-templates.ts
└── types/skill.ts            SkillConfig, GeneratedFile, QualityReport, etc.
```

### Adding a new category

1. Add the category id to the `SkillCategory` union in `src/types/skill.ts`.
2. Flip its `status` to `"available"` in `src/lib/skill-builder/categories.ts`.
3. Add a preset to `PRESETS` in `src/lib/skill-builder/default-preset.ts` with a
   `buildConfig` factory returning a valid `SkillConfig`.
4. If the category needs different blocks or templates, branch on `config.category`
   inside `generate-package.ts` or add a category-specific renderer.

### Generation pipeline

```
SkillConfig → block resolver → template renderer → file tree → quality checker
```

No AI is invoked anywhere in the MVP. All output is deterministic.

## Phase 2 (not yet implemented)

- AI route for Korean translation of a selected file.
- AI route for partial regeneration with user instructions.
- LocalStorage drafts.
- Saved package history.

These hooks already exist as disabled UI affordances so wiring them is additive.
