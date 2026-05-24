import type { SkillConfig } from "@/types/skill";
import { REQUIRED_FILES_BY_TYPE } from "../package-matrix";
import { CAPABILITY_PACKS } from "../blocks/capability-packs";

export function renderReadmeMd(config: SkillConfig): string {
  const required = REQUIRED_FILES_BY_TYPE[config.packageType];
  const opts = config.packageOptions;
  const want = {
    skillMd: required.skillMd || opts.includeSkillMd,
    catalogMd: required.catalogMd || opts.includeCatalogMd,
    readmeMd: required.readmeMd || opts.includeReadme,
    workUnitJson: required.workUnitJson || opts.includeWorkUnitJson,
    hooksJson: required.hooksJson || opts.includeHooksJson,
    references: required.references || opts.includeReferences,
    templates: required.templates || opts.includeTemplates,
    checklists: required.checklists || opts.includeChecklists,
    tests: required.tests || opts.includeTests,
    examples: required.examples || opts.includeExamples,
  };

  const lines: string[] = [];
  lines.push(`# ${config.packageName}`, "");
  lines.push(config.description, "");

  lines.push("## What this kit is");
  lines.push(
    `An AXDD Standard Kit for ${labelForCategory(config.category)} workflows (package type: \`${config.packageType}\`). Generated deterministically by AxDD Skill Builder — no AI required to produce or regenerate the kit.`,
    "",
  );

  lines.push("## Who it is for");
  lines.push(
    "Designers, makers, and product builders who want a repeatable, agent-friendly workflow — and the AI agents driving them.",
    "",
  );

  lines.push("## Package structure");
  lines.push("```txt");
  lines.push(`${config.packageName}/`);
  if (want.skillMd) lines.push("├── SKILL.md");
  if (want.catalogMd) lines.push("├── CATALOG.md");
  if (want.readmeMd) lines.push("├── README.md");
  if (want.workUnitJson) lines.push("├── WORK_UNIT.json");
  if (want.hooksJson) lines.push("├── HOOKS.json");
  if (want.references) {
    lines.push("├── references/");
    lines.push("│   ├── ux-principles.md");
    lines.push("│   ├── ui-patterns.md");
    if (config.roleProfile.designSystemAwareness)
      lines.push("│   ├── design-system-rules.md");
    if (config.qualityRules.includes("include-accessibility"))
      lines.push("│   ├── accessibility-checklist.md");
    // Capability-pack-driven reference files (e.g. design-taste,
    // web-best-practices, tailwind-mapping).
    for (const pack of CAPABILITY_PACKS) {
      if (!config.capabilityPacks.includes(pack.id)) continue;
      if (!pack.referenceFile) continue;
      lines.push(`│   ├── ${pack.referenceFile.fileName}`);
    }
    if (config.packageType === "full-step-skill") {
      lines.push("│   └── stage-guides/");
      lines.push("│       ├── requirement-intake-guide.md");
      lines.push("│       ├── ux-foundation-guide.md");
      lines.push("│       ├── ui-design-foundation-guide.md");
      lines.push("│       ├── prototype-planning-guide.md");
      lines.push("│       ├── review-validation-guide.md");
      lines.push("│       └── handoff-guide.md");
    }
  }
  if (want.templates) {
    lines.push("├── templates/");
    lines.push("│   ├── ux-brief-template.md");
    lines.push("│   ├── screen-spec-template.md");
    lines.push("│   ├── design-review-template.md");
    if (config.outputFormat.includeCursorPrompt)
      lines.push("│   ├── cursor-prompt-template.md");
    if (config.category === "ux-ui")
      lines.push("│   └── figma-instruction-template.md");
  }
  if (want.checklists) {
    lines.push("├── checklists/");
    lines.push("│   ├── ux-foundation-checklist.md");
    lines.push("│   ├── ui-design-checklist.md");
    lines.push("│   ├── handoff-checklist.md");
    lines.push("│   └── release-checklist.md");
  }
  if (want.tests) {
    lines.push("├── tests/");
    lines.push("│   ├── sandbox-test-scenario.md");
    lines.push("│   └── validation-log-template.md");
  }
  if (want.examples) {
    lines.push("└── examples/");
    lines.push("    └── ux-ui-example.md");
  }
  lines.push("```", "");

  lines.push("## File roles");
  lines.push("");
  if (want.skillMd)
    lines.push(
      "- **`SKILL.md`** — agent entry point. Role, core principle, workflow overview, output rules.",
    );
  if (want.catalogMd)
    lines.push(
      "- **`CATALOG.md`** — inventory of every skill, template, checklist, and test in the kit, with id, when-to-use, inputs, outputs, and related files. Scannable without opening every file.",
    );
  if (want.readmeMd)
    lines.push("- **`README.md`** — human-facing onboarding (this file).");
  if (want.workUnitJson)
    lines.push(
      "- **`WORK_UNIT.json`** — machine-readable workflow definition. Stages, entry / exit criteria, procedures, decision rules, quality gates, failure handling, and next-stage routing. The authoritative pipeline an agent executes.",
    );
  if (want.hooksJson)
    lines.push(
      "- **`HOOKS.json`** — keyword / intent triggers that route an incoming request to the right stage, template, reference, or checklist. Includes confidence, fallback stage, required context, and skip conditions.",
    );
  if (want.references)
    lines.push(
      "- **`references/`** — domain knowledge the agent consults during work. The `stage-guides/` subfolder contains one deep guide per workflow stage.",
    );
  if (want.templates)
    lines.push(
      "- **`templates/`** — copy-ready artifacts (briefs, specs, reviews, prompts, Figma manual fallback).",
    );
  if (want.checklists)
    lines.push(
      "- **`checklists/`** — exit gates per stage plus a final release gate. Each item supports Evidence / Issue / Fix / Accepted exception.",
    );
  if (want.tests)
    lines.push(
      "- **`tests/`** — sandbox scenarios and a validation log template. Run before release; log each run.",
    );
  if (want.examples)
    lines.push(
      "- **`examples/`** — realistic walk-throughs showing the kit end to end.",
    );
  lines.push("");

  lines.push("## How to install or use");
  lines.push(
    "1. Drop this folder into your AI agent's skill / instruction directory.",
    "2. Point the agent at `SKILL.md` as the entry instruction.",
    "3. Wire `HOOKS.json` so incoming requests route to the correct workflow stage in `WORK_UNIT.json`.",
    "4. Reference `templates/`, `references/`, `checklists/`, and `tests/` as the workflow advances.",
    "",
  );

  lines.push("## How to customize");
  lines.push(
    "- Edit `SKILL.md` to change role, workflow, output, or rules.",
    "- Edit `WORK_UNIT.json` to adjust stage purpose / procedure / quality gates.",
    "- Edit `HOOKS.json` to add or rebalance trigger keywords and intents.",
    "- Add new templates / references / checklists / tests in their folders and link them from `CATALOG.md`.",
    "- Run the scenarios in `tests/sandbox-test-scenario.md` after any change; log the result in `tests/validation-log-template.md`.",
    "",
  );

  lines.push("## Example prompts");
  lines.push(
    "- *Design an order status screen for a food delivery app.*",
    "- *Review this signup screen and list UX issues by priority.*",
    "- *Figma MCP is blocked in our company — how do we prototype?*",
    "- *Turn this screen spec into a Cursor-ready implementation prompt.*",
    "",
  );

  return lines.join("\n");
}

function labelForCategory(category: SkillConfig["category"]): string {
  switch (category) {
    case "ux-ui":
      return "UX/UI design";
    case "product":
      return "product planning";
    case "frontend":
      return "frontend implementation";
    case "design-system":
      return "design system";
    case "research":
      return "research";
    case "content":
      return "content planning";
    case "data":
      return "data analysis";
    case "harness":
      return "harness setup";
  }
}
