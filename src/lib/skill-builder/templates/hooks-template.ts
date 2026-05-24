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
  confidence: "high" | "medium" | "low";
  fallbackStage: WorkflowStageId | null;
  requiresContext: string[];
  skipIf: string[];
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
    confidence: "high",
    fallbackStage: "ux-foundation",
    requiresContext: ["primary user role", "observable success state"],
    skipIf: [
      "a UX brief already exists for this request",
      "the user explicitly asks to skip intake and start designing",
    ],
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
    confidence: "high",
    fallbackStage: "requirement-intake",
    requiresContext: ["UX brief"],
    skipIf: ["screen inventory already exists and is current"],
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
    confidence: "high",
    fallbackStage: "ux-foundation",
    requiresContext: ["screen name", "screen purpose", "primary action"],
    skipIf: ["a current screen-spec already exists for this screen"],
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
    confidence: "high",
    fallbackStage: "prototype-planning",
    requiresContext: [
      "screen specifications ready",
      "Figma file URL (or note that it does not exist yet)",
    ],
    skipIf: ["Figma MCP is verified available right now"],
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
    confidence: "medium",
    fallbackStage: "ui-design-foundation",
    requiresContext: [
      "screen specifications or built frames to review",
      "intended primary action per screen",
    ],
    skipIf: [
      "the request is a vague taste opinion rather than a review",
      "no specs or frames are attached",
    ],
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
    confidence: "high",
    fallbackStage: "review-validation",
    requiresContext: [
      "validation log shows no unresolved blockers",
      "release-checklist is reachable",
    ],
    skipIf: ["the validation gate has not yet passed"],
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
