import type { SkillConfig, WorkflowStageId } from "@/types/skill";

type Hook = {
  id: string;
  triggerType: "keyword" | "intent";
  triggers: string[];
  routeTo: {
    stage?: WorkflowStageId;
    template?: string;
    reference?: string;
    checklist?: string;
  };
  description: string;
};

const DEFAULT_HOOKS: Hook[] = [
  {
    id: "hook-intake",
    triggerType: "keyword",
    triggers: ["new idea", "rough requirement", "kickoff", "brief"],
    routeTo: {
      stage: "requirement-intake",
      template: "templates/ux-brief-template.md",
    },
    description: "Route fresh product ideas into Requirement Intake.",
  },
  {
    id: "hook-flow",
    triggerType: "intent",
    triggers: ["design user flow", "information architecture", "screen inventory"],
    routeTo: {
      stage: "ux-foundation",
      reference: "references/ux-principles.md",
    },
    description: "Route flow / IA requests into UX Foundation.",
  },
  {
    id: "hook-screen",
    triggerType: "intent",
    triggers: ["design this screen", "screen spec", "component breakdown"],
    routeTo: {
      stage: "ui-design-foundation",
      template: "templates/screen-spec-template.md",
    },
    description: "Route per-screen design requests into UI Design Foundation.",
  },
  {
    id: "hook-figma-mcp-blocked",
    triggerType: "keyword",
    triggers: ["figma blocked", "no figma mcp", "enterprise figma", "manual figma"],
    routeTo: {
      stage: "prototype-planning",
      template: "templates/figma-instruction-template.md",
    },
    description:
      "Fallback to manual Figma instructions when Figma MCP is unavailable.",
  },
  {
    id: "hook-review",
    triggerType: "keyword",
    triggers: ["review", "accessibility", "a11y", "validate"],
    routeTo: {
      stage: "review-validation",
      template: "templates/design-review-template.md",
    },
    description: "Route review and accessibility requests into Review & Validation.",
  },
  {
    id: "hook-handoff",
    triggerType: "keyword",
    triggers: ["handoff", "implementation prompt", "ship", "release"],
    routeTo: {
      stage: "handoff",
      checklist: "checklists/release-checklist.md",
    },
    description: "Route handoff and release requests into Handoff.",
  },
];

export function renderHooksJson(config: SkillConfig): string {
  const doc = {
    kitName: config.skillName,
    hooks: DEFAULT_HOOKS,
  };
  return JSON.stringify(doc, null, 2) + "\n";
}
