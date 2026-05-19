import type { SkillConfig } from "@/types/skill";
import { roleBlock, roleAwarenessLines } from "../blocks/role-blocks";
import { workflowBlocksFor } from "../blocks/workflow-blocks";
import { outputFormatBlock } from "../blocks/output-blocks";
import { ruleLines } from "../blocks/rule-blocks";
import { CAPABILITY_PACKS } from "../blocks/capability-packs";

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
  const triggers: string[] = [];
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
    triggers.push("The user wants to review an existing screen for UX/UI issues.");
  }
  return ["## When to use this skill", ...triggers.map((t) => `- ${t}`)].join("\n");
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

function corePrincipleBlock(): string {
  return [
    "## Core principle",
    "Do not jump directly into visual styling. Define the user problem, the primary action, and the information hierarchy first. Visual decisions follow structure, not the other way around.",
  ].join("\n");
}

function workflowSection(config: SkillConfig): string {
  const blocks = workflowBlocksFor(config.workflowModules);
  if (blocks.length === 0) return "";
  return ["## Workflow modes", ...blocks.map((b) => b.content)].join("\n\n");
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
    corePrincipleBlock(),
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
