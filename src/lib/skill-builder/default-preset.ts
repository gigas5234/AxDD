import type { SkillCategory, SkillConfig } from "@/types/skill";
import { PACKS_BY_CATEGORY } from "./blocks/capability-packs";
import { WORKFLOW_BY_CATEGORY } from "./blocks/workflow-blocks";
import { RULES_BY_CATEGORY } from "./blocks/rule-blocks";

// Surface the rules-by-category map so other modules can use it without
// reaching into the rule-blocks file directly.
export { RULES_BY_CATEGORY };

void PACKS_BY_CATEGORY;

export type PresetDescriptor = {
  id: string;
  name: string;
  category: SkillCategory;
  bestFor: string;
  expectedOutput: string[];
  status: "available" | "coming-soon";
  buildConfig?: () => SkillConfig;
};

function nowIso(): string {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// UX/UI Designer (existing default)
// ─────────────────────────────────────────────────────────────────────────────
export function buildUxUiDefaultConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-ux-ui-standard-kit",
    skillName: "AXDD UX/UI Standard Kit",
    packageName: "axdd-ux-ui-standard-kit",
    description:
      "AXDD Standard Kit for AI-assisted UX/UI design — from requirement intake through handoff — with references, templates, checklists, and validation tests.",
    category: "ux-ui",
    packageType: "full-step-skill",
    targetAgent: "generic",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["UX Strategy", "UI Design", "Design Systems", "Figma to Code"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: true,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY["ux-ui"]].filter(
      (m) => m !== "accessibility-check",
    ),
    workflowStages: [
      "requirement-intake",
      "ux-foundation",
      "ui-design-foundation",
      "prototype-planning",
      "review-validation",
      "handoff",
    ],
    capabilityPacks: ["design-taste", "web-best-practices", "tailwind-first"],
    outputFormat: {
      answerStyle: "structured",
      includeMarkdown: true,
      includeJson: true,
      includeTables: false,
      includeCursorPrompt: true,
      includeChecklists: true,
      includeExamples: true,
    },
    qualityRules: [
      "avoid-vague-language",
      "define-primary-action",
      "include-information-hierarchy",
      "include-screen-states",
      "componentize-output",
      "include-responsive-notes",
      "include-accessibility",
      "avoid-unnecessary-questions",
      "avoid-overlong-chat-response",
    ],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: true,
      includeTemplates: true,
      includeExamples: true,
      includeCatalogMd: true,
      includeWorkUnitJson: true,
      includeHooksJson: true,
      includeChecklists: true,
      includeTests: true,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UX/UI Reference Skill (lightweight references-focused)
// ─────────────────────────────────────────────────────────────────────────────
export function buildUxUiReferenceSkillConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-ux-ui-reference-skill",
    skillName: "UX/UI Reference Skill",
    packageName: "axdd-ux-ui-reference-skill",
    description:
      "Lightweight UX/UI skill that guides AI outputs using design principles, design system rules, accessibility rules, and implementation mapping references.",
    category: "ux-ui",
    packageType: "reference-skill",
    targetAgent: "generic",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["UX Principles", "UI Patterns", "Design Systems", "Accessibility"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: false,
    },
    workflowModules: [],
    workflowStages: [],
    capabilityPacks: ["design-taste", "web-best-practices", "tailwind-first"],
    outputFormat: {
      answerStyle: "structured",
      includeMarkdown: true,
      includeJson: false,
      includeTables: false,
      includeCursorPrompt: false,
      includeChecklists: false,
      includeExamples: true,
    },
    qualityRules: [
      "avoid-vague-language",
      "define-primary-action",
      "include-information-hierarchy",
      "include-accessibility",
      "avoid-overlong-chat-response",
    ],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: true,
      includeTemplates: false,
      includeExamples: true,
      includeCatalogMd: true,
      includeWorkUnitJson: false,
      includeHooksJson: false,
      includeChecklists: false,
      includeTests: false,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UX/UI Review & Validation Skill (test-skill — validation-focused)
// ─────────────────────────────────────────────────────────────────────────────
export function buildUxUiTestSkillConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-ux-ui-review-validation-skill",
    skillName: "UX/UI Review & Validation Skill",
    packageName: "axdd-ux-ui-review-validation-skill",
    description:
      "Validation-focused UX/UI skill — audits screens, prompts, Figma instructions, and handoff deliverables against UX/UI quality and accessibility checklists.",
    category: "ux-ui",
    packageType: "test-skill",
    targetAgent: "generic",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["UX Review", "Accessibility", "Handoff Validation"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: false,
    },
    workflowModules: [],
    workflowStages: [],
    capabilityPacks: ["web-best-practices"],
    outputFormat: {
      answerStyle: "structured",
      includeMarkdown: true,
      includeJson: true,
      includeTables: true,
      includeCursorPrompt: false,
      includeChecklists: true,
      includeExamples: true,
    },
    qualityRules: [
      "avoid-vague-language",
      "define-primary-action",
      "include-information-hierarchy",
      "include-screen-states",
      "include-responsive-notes",
      "include-accessibility",
      "avoid-overlong-chat-response",
    ],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: false,
      includeTemplates: false,
      includeExamples: true,
      includeCatalogMd: true,
      includeWorkUnitJson: false,
      includeHooksJson: false,
      includeChecklists: true,
      includeTests: true,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Frontend Implementation
// ─────────────────────────────────────────────────────────────────────────────
export function buildFrontendDefaultConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-frontend-default",
    skillName: "axdd-frontend-implementation",
    packageName: "axdd-frontend-implementation",
    description:
      "Frontend implementation skill — turn specs and tokens into shippable React + Tailwind code.",
    category: "frontend",
    packageType: "full-step-skill",
    targetAgent: "cursor",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["React", "TypeScript", "Tailwind", "Testing"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: false,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY.frontend],
    workflowStages: [],
    capabilityPacks: [
      "react-patterns",
      "typescript-strict",
      "tailwind-first",
      "shadcn-affinity",
    ],
    outputFormat: {
      answerStyle: "structured",
      includeMarkdown: true,
      includeJson: false,
      includeTables: false,
      includeCursorPrompt: true,
      includeChecklists: true,
      includeExamples: true,
    },
    qualityRules: [...RULES_BY_CATEGORY.frontend],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: true,
      includeTemplates: true,
      includeExamples: true,
      includeCatalogMd: true,
      includeWorkUnitJson: true,
      includeHooksJson: true,
      includeChecklists: true,
      includeTests: true,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Design System Generator
// ─────────────────────────────────────────────────────────────────────────────
export function buildDesignSystemDefaultConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-design-system-default",
    skillName: "axdd-design-system",
    packageName: "axdd-design-system",
    description:
      "Design system generation skill — build tokens, primitives, and component rules from brand direction.",
    category: "design-system",
    packageType: "full-step-skill",
    targetAgent: "generic",
    roleProfile: {
      roleLevel: "expert",
      domainFocus: ["Tokens", "Primitives", "Component API", "Documentation"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: true,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY["design-system"]],
    workflowStages: [],
    capabilityPacks: [
      "design-taste",
      "theme-factory",
      "visual-composition",
      "tailwind-first",
    ],
    outputFormat: {
      answerStyle: "detailed",
      includeMarkdown: true,
      includeJson: true,
      includeTables: true,
      includeCursorPrompt: false,
      includeChecklists: true,
      includeExamples: true,
    },
    qualityRules: [...RULES_BY_CATEGORY["design-system"]],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: true,
      includeTemplates: true,
      includeExamples: true,
      includeCatalogMd: true,
      includeWorkUnitJson: true,
      includeHooksJson: true,
      includeChecklists: true,
      includeTests: true,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Harness Setup
// ─────────────────────────────────────────────────────────────────────────────
export function buildHarnessDefaultConfig(): SkillConfig {
  const ts = nowIso();
  return {
    id: "axdd-harness-default",
    skillName: "axdd-harness-setup",
    packageName: "axdd-harness-setup",
    description:
      "Harness setup helper — install paths, permissions, hooks, and conversion notes for Claude Code / Cursor / Codex.",
    category: "harness",
    packageType: "full-step-skill",
    targetAgent: "claude-code",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["Harness configuration", "Skill packaging", "Permissions"],
      implementationAwareness: true,
      designSystemAwareness: false,
      businessAwareness: false,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY.harness],
    workflowStages: [],
    capabilityPacks: ["claude-code-target"],
    outputFormat: {
      answerStyle: "concise",
      includeMarkdown: true,
      includeJson: true,
      includeTables: true,
      includeCursorPrompt: false,
      includeChecklists: true,
      includeExamples: true,
    },
    qualityRules: [
      "avoid-vague-language",
      "avoid-unnecessary-questions",
      "avoid-overlong-chat-response",
    ],
    language: {
      primaryLanguage: "en",
      previewLanguages: ["en", "ko"],
      generateKoreanByDefault: false,
      translationMode: "on-demand",
    },
    packageOptions: {
      includeSkillMd: true,
      includeReadme: true,
      includeReferences: true,
      includeTemplates: false,
      includeExamples: true,
      includeCatalogMd: false,
      includeWorkUnitJson: false,
      includeHooksJson: false,
      includeChecklists: false,
      includeTests: false,
      exportFormat: "zip",
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Preset registry
// ─────────────────────────────────────────────────────────────────────────────
export const PRESETS: PresetDescriptor[] = [
  {
    id: "ux-ui-axdd-default",
    name: "AXDD UX/UI Standard Kit",
    category: "ux-ui",
    bestFor:
      "Compose the full UX/UI Standard Kit (SKILL + CATALOG + WORK_UNIT + HOOKS + references / templates / checklists / tests / examples).",
    expectedOutput: [
      "SKILL.md, CATALOG.md, README.md",
      "WORK_UNIT.json (6 stages)",
      "HOOKS.json (keyword + intent routing)",
      "references / templates / checklists / tests / examples",
      "Figma manual fallback template",
    ],
    status: "available",
    buildConfig: buildUxUiDefaultConfig,
  },
  {
    id: "frontend-axdd-default",
    name: "Frontend Implementation — AxDD Default",
    category: "frontend",
    bestFor:
      "Translating specs and design tokens into React + Tailwind components with TypeScript discipline.",
    expectedOutput: [
      "React patterns reference",
      "TypeScript strict guide",
      "Component implementation workflow",
      "Performance budget rules",
    ],
    status: "available",
    buildConfig: buildFrontendDefaultConfig,
  },
  {
    id: "design-system-axdd-default",
    name: "Design System Generator — AxDD Default",
    category: "design-system",
    bestFor:
      "Building a complete token + primitive + variant system from a brand direction.",
    expectedOutput: [
      "Token system reference",
      "Primitive design rules",
      "Variant matrix",
      "Documentation strategy",
    ],
    status: "available",
    buildConfig: buildDesignSystemDefaultConfig,
  },
  // Harness preset hidden until the output pipeline is complete.
  // {
  //   id: "harness-axdd-default",
  //   name: "Harness Setup — Claude Code",
  //   ...
  // },
  {
    id: "axdd-ux-ui-reference-skill",
    name: "UX/UI Reference Skill",
    category: "ux-ui",
    bestFor:
      "Lightweight UX/UI skill — guide AI outputs from references (principles, patterns, design-system rules, accessibility, implementation mapping).",
    expectedOutput: [
      "SKILL.md, README.md, CATALOG.md",
      "references/ (principles + patterns + design system + accessibility + tailwind mapping)",
      "examples/",
    ],
    status: "available",
    buildConfig: buildUxUiReferenceSkillConfig,
  },
  {
    id: "axdd-ux-ui-review-validation-skill",
    name: "UX/UI Review & Validation Skill",
    category: "ux-ui",
    bestFor:
      "Validation-focused UX/UI skill — audit screens, prompts, Figma instructions, and handoff deliverables.",
    expectedOutput: [
      "SKILL.md, README.md, CATALOG.md",
      "checklists/ (ux-foundation, ui-design, handoff, release)",
      "tests/ (sandbox-test-scenario, validation-log-template)",
      "examples/",
    ],
    status: "available",
    buildConfig: buildUxUiTestSkillConfig,
  },

  // ── Frontend variations (coming-soon) ─────────────────────────────────────
  {
    id: "frontend-test-first",
    name: "Test-First Frontend",
    category: "frontend",
    bestFor:
      "Test-driven React development — tests describe behavior, components follow.",
    expectedOutput: [
      "Testing discipline reference",
      "Behavior-first test patterns",
      "Component implementation aligned with tests",
    ],
    status: "coming-soon",
  },
  {
    id: "frontend-server-components",
    name: "Server Components First",
    category: "frontend",
    bestFor:
      "Modern React with Server Components as default; client islands only when needed.",
    expectedOutput: [
      "Server/client boundary rules",
      "Data-fetching at server, props down to client",
      "Performance budget aligned to RSC",
    ],
    status: "coming-soon",
  },

  // ── Design System variations (coming-soon) ────────────────────────────────
  {
    id: "ds-token-only",
    name: "Token-Only Starter",
    category: "design-system",
    bestFor:
      "Tokens only — color, type, spacing, radius. Skip primitives and components for now.",
    expectedOutput: [
      "Token system reference",
      "Tailwind theme mapping",
      "Token JSON export",
    ],
    status: "coming-soon",
  },
  {
    id: "ds-component-library",
    name: "Component Library Builder",
    category: "design-system",
    bestFor:
      "Full component library — tokens + primitives + variants + documentation strategy.",
    expectedOutput: [
      "Primitive specs (Button, Input, Card, …)",
      "Variant matrix per primitive",
      "Documentation strategy",
      "Migration plan from legacy UI",
    ],
    status: "coming-soon",
  },
];

// Map category → default preset id (for category switching UX)
export const DEFAULT_PRESET_BY_CATEGORY: Partial<Record<SkillCategory, string>> = {
  "ux-ui": "ux-ui-axdd-default",
  frontend: "frontend-axdd-default",
  "design-system": "design-system-axdd-default",
  harness: "harness-axdd-default",
};

export function buildDefaultConfigForCategory(
  category: SkillCategory,
): SkillConfig {
  switch (category) {
    case "frontend":
      return buildFrontendDefaultConfig();
    case "design-system":
      return buildDesignSystemDefaultConfig();
    case "harness":
      return buildHarnessDefaultConfig();
    case "ux-ui":
    default:
      return buildUxUiDefaultConfig();
  }
}
