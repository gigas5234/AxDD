import type { SkillConfig } from "@/types/skill";
import { roleBlock, roleAwarenessLines } from "../blocks/role-blocks";
import { workflowBlocksFor } from "../blocks/workflow-blocks";
import { outputFormatBlock } from "../blocks/output-blocks";
import { ruleLines } from "../blocks/rule-blocks";
import { CAPABILITY_PACKS } from "../blocks/capability-packs";
import { STAGE_METADATA, ALL_STAGES } from "../package-matrix";

function frontmatter(config: SkillConfig): string {
  return [
    "---",
    `name: ${config.skillName}`,
    `description: ${config.description}`,
    `category: ${config.category}`,
    `target_agent: ${config.targetAgent}`,
    `primary_language: ${config.language.primaryLanguage}`,
    "---",
  ].join("\n");
}

function whenToUseBlock(config: SkillConfig): string {
  let triggers: string[] = [];
  switch (config.id) {
    case "axdd-cursor-handoff-kit":
      triggers = [
        "The user has a completed screen specification and wants an implementation-ready Cursor / Claude Code prompt.",
        "The user wants to audit an existing handoff prompt against the release checklist.",
        "The user wants to check that tokens / acceptance criteria are concrete before shipping.",
      ];
      break;
    case "axdd-ux-ui-reference-review":
      triggers = [
        "The user has an existing screen, prompt, Figma frame, or handoff deliverable and wants it audited against UX/UI references.",
        "The user wants an accessibility, design-system, or consistency audit.",
        "The user wants a prioritized fix list backed by references — not taste opinions.",
      ];
      break;
    case "axdd-figma-manual-instruction-kit":
      triggers = [
        "Figma MCP is unavailable / blocked and the user needs manual build instructions.",
        "The user has a screen specification and needs frame-by-frame Figma steps.",
        "The user needs the parity checklist that ties a Figma build back to the spec.",
      ];
      break;
    case "axdd-ux-validation-governance-kit":
      triggers = [
        "The user wants to validate a deliverable against sandbox scenarios.",
        "The user needs to record validation runs and accepted exceptions in a governance log.",
        "The user needs kit-level metadata (KIT_MANIFEST.json) for asset discovery.",
      ];
      break;
    default:
      // Full-step (Standard Kit) or any other category — generic triggers.
      triggers.push("The user is designing a screen, flow, or product surface.");
      triggers.push(
        "The user provides a rough idea, requirement, screenshot, or feature request that needs UX structure.",
      );
      if (config.outputFormat.includeCursorPrompt) {
        triggers.push(
          "The user wants an implementation-ready prompt for a code agent (Cursor, Claude Code, etc.).",
        );
      }
      if (config.workflowModules.includes("ux-review")) {
        triggers.push(
          "The user wants to review an existing screen for UX/UI issues.",
        );
      }
  }
  return ["## When to use this skill", ...triggers.map((t) => `- ${t}`)].join(
    "\n",
  );
}

function roleSection(config: SkillConfig): string {
  const role = roleBlock(config.roleProfile.roleLevel, config.roleProfile.domainFocus);
  const awareness = roleAwarenessLines({
    implementationAwareness: config.roleProfile.implementationAwareness,
    designSystemAwareness: config.roleProfile.designSystemAwareness,
    businessAwareness: config.roleProfile.businessAwareness,
  });
  return [
    "## Role",
    role.content,
    "",
    ...(awareness.length ? ["**Awareness:**", ...awareness.map((l) => `- ${l}`)] : []),
  ].join("\n");
}

function corePrincipleBlock(config: SkillConfig): string {
  let body: string;
  switch (config.id) {
    case "axdd-cursor-handoff-kit":
      body =
        "Do not ship a handoff prompt without a complete screen specification, concrete acceptance criteria, and a ticked release checklist. Tokens go in by reference, never as raw values.";
      break;
    case "axdd-ux-ui-reference-review":
      body =
        "Every finding must cite a reference and propose a concrete fix. Taste opinions are not findings. Do not invoke workflow stages this kit does not ship.";
      break;
    case "axdd-figma-manual-instruction-kit":
      body =
        "Use the manual instruction template when Figma MCP is unavailable. Build by frame, name by convention, apply tokens — never hardcode raw values. Log any missing tokens as open issues.";
      break;
    case "axdd-ux-validation-governance-kit":
      body =
        "Validation is binary per criterion. Log every run; accepted exceptions need a reviewer signature. Metadata exists so other kits can discover this one.";
      break;
    default:
      body =
        "Do not jump directly into visual styling. Define the user problem, the primary action, and the information hierarchy first. Visual decisions follow structure, not the other way around.";
  }
  return ["## Core principle", body].join("\n");
}

function workflowSection(config: SkillConfig): string {
  if (config.packageType === "full-step-skill") {
    return stageWorkflowSection(config);
  }
  const blocks = workflowBlocksFor(config.workflowModules);
  if (blocks.length === 0) return "";
  return ["## Workflow modes", ...blocks.map((b) => b.content)].join("\n\n");
}

function stageWorkflowSection(config: SkillConfig): string {
  const stageIds =
    config.workflowStages.length > 0 ? config.workflowStages : ALL_STAGES;
  const orderTitles = stageIds.map((id) => STAGE_METADATA[id].title).join(" → ");

  const sections: string[] = [
    "## Workflow modes",
    "",
    `This kit composes a 6-stage workflow defined in \`WORK_UNIT.json\`: ${orderTitles}.`,
    "",
  ];

  for (const id of stageIds) {
    const stage = STAGE_METADATA[id];
    const related = [
      ...stage.usesTemplates,
      ...stage.usesReferences,
      ...stage.usesChecklists,
    ];
    sections.push(`### ${stage.order}. ${stage.title} (\`${stage.id}\`)`);
    sections.push("");
    sections.push(`**Purpose** — ${stage.purpose}`);
    sections.push("");
    sections.push(`**When to use** — enter this stage once the prior stage's exit criteria are met, or when a hook in \`HOOKS.json\` routes a request to \`${stage.id}\`.`);
    sections.push("");
    sections.push("**Expected inputs**");
    for (const input of stage.inputs.length ? stage.inputs : ["—"]) {
      sections.push(`- ${input}`);
    }
    sections.push("");
    sections.push("**Expected outputs**");
    for (const output of stage.outputs.length ? stage.outputs : ["—"]) {
      sections.push(`- ${output}`);
    }
    sections.push("");
    if (related.length > 0) {
      sections.push("**Related files**");
      for (const r of related) {
        sections.push(`- \`${r}\``);
      }
      sections.push("");
    }
    if (stage.exitCriteria.length > 0) {
      sections.push("**Exit criteria**");
      for (const c of stage.exitCriteria) {
        sections.push(`- ${c}`);
      }
      sections.push("");
    }
  }

  return sections.join("\n").trimEnd();
}

function outputSection(config: SkillConfig): string {
  return outputFormatBlock(config.outputFormat).content;
}

function rulesSection(config: SkillConfig): string {
  const lines = ruleLines(config.qualityRules);
  // Add extra rules from active capability packs
  const packRules: string[] = [];
  for (const pack of CAPABILITY_PACKS) {
    if (!config.capabilityPacks.includes(pack.id)) continue;
    if (!pack.extraRules) continue;
    for (const r of pack.extraRules) {
      packRules.push(`- ${r}`);
    }
  }
  const all = [...lines, ...packRules];
  if (all.length === 0) return "";
  return ["## Design quality rules", ...all].join("\n");
}

function capabilityPackSections(config: SkillConfig): string {
  const sections: string[] = [];
  for (const pack of CAPABILITY_PACKS) {
    if (!config.capabilityPacks.includes(pack.id)) continue;
    if (!pack.skillMdSection) continue;
    sections.push(`## ${pack.skillMdSection.heading}`);
    sections.push(pack.skillMdSection.body);
    sections.push("");
  }
  return sections.join("\n");
}

function implementationRulesSection(config: SkillConfig): string {
  const lines: string[] = [];
  if (config.outputFormat.includeCursorPrompt) {
    lines.push(
      "- When producing implementation handoff, emit a Cursor-ready prompt using `templates/cursor-prompt-template.md`.",
    );
  }
  if (config.roleProfile.designSystemAwareness) {
    lines.push(
      "- Express styling decisions as tokens and primitives; do not invent ad-hoc values.",
    );
  }
  if (config.roleProfile.implementationAwareness) {
    lines.push(
      "- Flag any spec that cannot be implemented with the target framework's primitives.",
    );
  }
  if (lines.length === 0) return "";
  return ["## Implementation rules", ...lines].join("\n");
}

function finalReviewSection(config: SkillConfig): string {
  const lines: string[] = [
    "- [ ] Primary action defined on every screen",
    "- [ ] Information hierarchy ranked",
    "- [ ] Default / empty / loading / error states specified",
    "- [ ] Components named and reusable",
  ];
  if (config.qualityRules.includes("include-responsive-notes")) {
    lines.push("- [ ] Responsive notes for mobile / tablet / desktop");
  }
  if (config.qualityRules.includes("include-accessibility")) {
    lines.push("- [ ] Accessibility checklist passed");
  }
  return ["## Final review checklist", ...lines].join("\n");
}

export function renderSkillMd(config: SkillConfig): string {
  const sections = [
    frontmatter(config),
    "",
    `# ${config.skillName}`,
    "",
    config.description,
    "",
    whenToUseBlock(config),
    "",
    roleSection(config),
    "",
    corePrincipleBlock(config),
    "",
    workflowSection(config),
    "",
    capabilityPackSections(config),
    "",
    outputSection(config),
    "",
    rulesSection(config),
    "",
    implementationRulesSection(config),
    "",
    finalReviewSection(config),
  ];
  if (config.customInstructions && config.customInstructions.trim().length > 0) {
    sections.push("", "## Custom instructions", config.customInstructions.trim());
  }
  return sections.filter((s) => s !== undefined).join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
