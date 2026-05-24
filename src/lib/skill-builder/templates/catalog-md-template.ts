import type { GeneratedFile, SkillConfig } from "@/types/skill";
import { ALL_STAGES, STAGE_METADATA } from "../package-matrix";

type Entry = {
  id: string;
  path: string;
  whenToUse: string;
  inputs: string[];
  outputs: string[];
  related: string[];
};

const ENTRY_INDEX: Record<string, Omit<Entry, "id" | "path">> = {
  // references/
  "ux-principles.md": {
    whenToUse: "While defining flows or auditing IA in UX Foundation.",
    inputs: ["raw flow / IA draft"],
    outputs: ["principles applied to current draft"],
    related: ["checklists/ux-foundation-checklist.md"],
  },
  "ui-patterns.md": {
    whenToUse: "While composing screens in UI Design Foundation.",
    inputs: ["screen purpose", "primary action"],
    outputs: ["selected pattern + variation"],
    related: ["templates/screen-spec-template.md"],
  },
  "design-system-rules.md": {
    whenToUse: "When deciding tokens, primitives, and variants.",
    inputs: ["brand direction or existing system"],
    outputs: ["token + primitive decisions"],
    related: ["templates/screen-spec-template.md"],
  },
  "accessibility-checklist.md": {
    whenToUse: "During Review & Validation.",
    inputs: ["screen specs"],
    outputs: ["accessibility findings"],
    related: ["checklists/ui-design-checklist.md"],
  },
  // templates/
  "ux-brief-template.md": {
    whenToUse: "At Requirement Intake to capture problem, user, success.",
    inputs: ["rough product idea"],
    outputs: ["UX brief draft"],
    related: ["checklists/ux-foundation-checklist.md"],
  },
  "screen-spec-template.md": {
    whenToUse: "Per screen in UI Design Foundation.",
    inputs: ["screen name", "primary action"],
    outputs: ["screen specification"],
    related: [
      "references/ui-patterns.md",
      "references/design-system-rules.md",
    ],
  },
  "design-review-template.md": {
    whenToUse: "Per screen during Review & Validation.",
    inputs: ["screen specs", "implementation (if any)"],
    outputs: ["prioritized findings"],
    related: ["references/accessibility-checklist.md"],
  },
  "cursor-prompt-template.md": {
    whenToUse: "At Handoff to produce an implementation-ready prompt.",
    inputs: ["screen spec", "tokens"],
    outputs: ["Cursor prompt"],
    related: ["templates/screen-spec-template.md"],
  },
  "figma-instruction-template.md": {
    whenToUse: "When Figma MCP is unavailable / blocked by enterprise policy.",
    inputs: ["screen specification", "design tokens"],
    outputs: ["manual Figma build instructions"],
    related: ["templates/screen-spec-template.md"],
  },
  // checklists/
  "ux-foundation-checklist.md": {
    whenToUse: "Exit gate for UX Foundation.",
    inputs: ["flow + IA"],
    outputs: ["pass / fail with notes"],
    related: ["templates/ux-brief-template.md"],
  },
  "ui-design-checklist.md": {
    whenToUse: "Exit gate for UI Design Foundation and Review & Validation.",
    inputs: ["screen specs"],
    outputs: ["pass / fail with notes"],
    related: [
      "templates/screen-spec-template.md",
      "templates/design-review-template.md",
    ],
  },
  "handoff-checklist.md": {
    whenToUse: "Exit gate for Handoff.",
    inputs: ["screen specs", "implementation prompt"],
    outputs: ["pass / fail with notes"],
    related: ["templates/cursor-prompt-template.md"],
  },
  "release-checklist.md": {
    whenToUse: "Final gate before the kit (or its output) is released.",
    inputs: ["all prior stage outputs"],
    outputs: ["ship / hold decision"],
    related: ["tests/validation-log-template.md"],
  },
  // tests/
  "sandbox-test-scenario.md": {
    whenToUse: "During Review & Validation to validate kit output.",
    inputs: ["scenario brief"],
    outputs: ["pass / fail per scenario"],
    related: ["tests/validation-log-template.md"],
  },
  "validation-log-template.md": {
    whenToUse: "After each sandbox run.",
    inputs: ["scenario results"],
    outputs: ["log row"],
    related: ["checklists/release-checklist.md"],
  },
  // references/stage-guides/
  "requirement-intake-guide.md": {
    whenToUse: "While running the Requirement Intake stage.",
    inputs: ["raw product idea"],
    outputs: ["UX brief draft"],
    related: ["templates/ux-brief-template.md"],
  },
  "ux-foundation-guide.md": {
    whenToUse: "While running the UX Foundation stage.",
    inputs: ["UX brief"],
    outputs: ["user flow", "screen inventory"],
    related: ["checklists/ux-foundation-checklist.md"],
  },
  "ui-design-foundation-guide.md": {
    whenToUse: "While running the UI Design Foundation stage.",
    inputs: ["screen inventory"],
    outputs: ["screen specifications"],
    related: ["templates/screen-spec-template.md"],
  },
  "prototype-planning-guide.md": {
    whenToUse: "While running the Prototype Planning stage.",
    inputs: ["screen specifications"],
    outputs: ["prototype plan"],
    related: ["templates/figma-instruction-template.md"],
  },
  "review-validation-guide.md": {
    whenToUse: "While running the Review & Validation stage.",
    inputs: ["screen specs", "built frames"],
    outputs: ["findings", "scenario results"],
    related: [
      "templates/design-review-template.md",
      "tests/sandbox-test-scenario.md",
    ],
  },
  "handoff-guide.md": {
    whenToUse: "While running the Handoff stage.",
    inputs: ["validated specs", "passing validation log"],
    outputs: ["implementation prompt", "handoff package"],
    related: [
      "templates/cursor-prompt-template.md",
      "checklists/release-checklist.md",
    ],
  },
  // examples/
  "ux-ui-example.md": {
    whenToUse: "Reference example showing the full workflow end to end.",
    inputs: ["—"],
    outputs: ["—"],
    related: ["SKILL.md"],
  },
};

function row(e: Entry): string {
  return [
    `### \`${e.path}\``,
    `- **id:** \`${e.id}\``,
    `- **When to use:** ${e.whenToUse}`,
    `- **Inputs:** ${e.inputs.join(", ") || "—"}`,
    `- **Outputs:** ${e.outputs.join(", ") || "—"}`,
    `- **Related files:** ${e.related.length ? e.related.map((r) => `\`${r}\``).join(", ") : "—"}`,
  ].join("\n");
}

function groupHeader(label: string): string {
  return `\n## ${label}\n`;
}

export function renderCatalogMd(
  config: SkillConfig,
  files: GeneratedFile[],
): string {
  const grouped: Record<string, Entry[]> = {
    "references/": [],
    "references/stage-guides/": [],
    "templates/": [],
    "checklists/": [],
    "tests/": [],
    "examples/": [],
  };

  for (const f of files) {
    const parts = f.path.split("/");
    if (parts.length < 3) continue; // skip top-level files
    let folder = `${parts[parts.length - 2]}/`;
    if (parts.length >= 4 && parts[parts.length - 2] === "stage-guides") {
      folder = "references/stage-guides/";
    }
    if (!(folder in grouped)) continue;
    const meta = ENTRY_INDEX[f.fileName];
    if (!meta) continue;
    grouped[folder].push({
      id: `catalog-${f.fileName.replace(/\.[^.]+$/, "")}`,
      path: `${folder}${f.fileName}`,
      ...meta,
    });
  }

  const sections: string[] = [
    "---",
    `kit: ${config.skillName}`,
    `category: ${config.category}`,
    `package_type: ${config.packageType}`,
    "---",
    "",
    `# ${config.skillName} — CATALOG`,
    "",
    "Inventory of every skill, template, checklist, and test bundled in this kit.",
    "Each entry lists when to use it, expected inputs, produced outputs, and related files inside the kit.",
  ];

  // ── Workflow Skills (one per stage) — only for full-step kits ─────────────
  if (config.packageType === "full-step-skill") {
    sections.push("", "## Workflow Skills", "");
    sections.push(
      "Each workflow stage is itself a skill the agent invokes. Stages are defined in `WORK_UNIT.json` and routed by `HOOKS.json`.",
      "",
    );
    for (const id of ALL_STAGES) {
      const s = STAGE_METADATA[id];
      const guidePath = `references/stage-guides/${id}-guide.md`;
      const next = s.nextStage ?? "—";
      sections.push(`### \`${id}\` — ${s.title}`);
      sections.push(`- **id:** \`${id}\``);
      sections.push(`- **type:** \`stage-skill\``);
      sections.push(`- **When to use:** ${s.purpose}`);
      sections.push(
        `- **Required inputs:** ${s.inputs.length ? s.inputs.join(", ") : "—"}`,
      );
      sections.push(
        `- **Outputs:** ${s.outputs.length ? s.outputs.join(", ") : "—"}`,
      );
      sections.push(
        `- **Related templates:** ${
          s.usesTemplates.length
            ? s.usesTemplates.map((t) => `\`${t}\``).join(", ")
            : "—"
        }`,
      );
      sections.push(
        `- **Related references:** ${
          s.usesReferences.length
            ? s.usesReferences.map((r) => `\`${r}\``).join(", ")
            : "—"
        }`,
      );
      sections.push(
        `- **Related checklists:** ${
          s.usesChecklists.length
            ? s.usesChecklists.map((c) => `\`${c}\``).join(", ")
            : "—"
        }`,
      );
      sections.push(
        `- **Quality gate:** ${
          s.qualityGate.length ? s.qualityGate.join("; ") : "—"
        }`,
      );
      sections.push(`- **Next stage:** ${next === "—" ? "—" : `\`${next}\``}`);
      sections.push(`- **Stage guide:** \`${guidePath}\``);
      sections.push("");
    }
  }

  for (const [folder, entries] of Object.entries(grouped)) {
    if (entries.length === 0) continue;
    sections.push(groupHeader(folder));
    for (const e of entries) {
      sections.push(row(e));
      sections.push("");
    }
  }

  return sections.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
