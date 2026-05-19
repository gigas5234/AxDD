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
    id: "axdd-ux-ui-default",
    skillName: "axdd-ux-ui-designer",
    packageName: "axdd-ux-ui-designer",
    description:
      "AI-assisted UX/UI design workflow skill for product designers and makers.",
    category: "ux-ui",
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
    targetAgent: "cursor",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["React", "TypeScript", "Tailwind", "Testing"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: false,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY.frontend],
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
    targetAgent: "generic",
    roleProfile: {
      roleLevel: "expert",
      domainFocus: ["Tokens", "Primitives", "Component API", "Documentation"],
      implementationAwareness: true,
      designSystemAwareness: true,
      businessAwareness: true,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY["design-system"]],
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
    targetAgent: "claude-code",
    roleProfile: {
      roleLevel: "senior",
      domainFocus: ["Harness configuration", "Skill packaging", "Permissions"],
      implementationAwareness: true,
      designSystemAwareness: false,
      businessAwareness: false,
    },
    workflowModules: [...WORKFLOW_BY_CATEGORY.harness],
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
    name: "UX/UI Designer — AxDD Default",
    category: "ux-ui",
    bestFor:
      "Turning rough service ideas into UX structures, screens, and implementation prompts.",
    expectedOutput: [
      "SKILL.md for UX/UI design",
      "UX strategy workflow",
      "Screen specification templates",
      "Design review checklist",
      "Cursor-ready prompt template",
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
    id: "figma-to-code-helper",
    name: "Figma to Code Helper",
    category: "ux-ui",
    bestFor:
      "Turning screenshots, Figma descriptions, or UI references into React/Tailwind implementation plans.",
    expectedOutput: [
      "Scene graph output rules",
      "Asset map template",
      "Tailwind implementation rules",
      "Cursor prompt template",
    ],
    status: "coming-soon",
  },
  {
    id: "ux-review-assistant",
    name: "UX Review Assistant",
    category: "ux-ui",
    bestFor: "Reviewing existing screens and finding UX/UI issues.",
    expectedOutput: [
      "Review framework",
      "Usability checklist",
      "Accessibility checklist",
      "Prioritized fix format",
    ],
    status: "coming-soon",
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
