import type { SkillConfig } from "@/types/skill";
import { recommendedDefaultPacks } from "./blocks/capability-packs";

export type PresetDescriptor = {
  id: string;
  name: string;
  category: SkillConfig["category"];
  bestFor: string;
  expectedOutput: string[];
  status: "available" | "coming-soon";
  buildConfig?: () => SkillConfig;
};

function nowIso(): string {
  return new Date().toISOString();
}

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
    workflowModules: [
      "problem-definition",
      "user-flow",
      "information-architecture",
      "screen-design",
      "component-breakdown",
      "design-system-draft",
      "figma-to-code",
      "ux-review",
      "implementation-prompt",
    ],
    capabilityPacks: recommendedDefaultPacks(),
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
    id: "design-system-starter",
    name: "Design System Starter",
    category: "design-system",
    bestFor:
      "Creating design tokens and component rules from a product direction or visual style.",
    expectedOutput: [
      "Color token rules",
      "Typography rules",
      "Spacing rules",
      "Component variants",
      "Figma component spec template",
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
];
