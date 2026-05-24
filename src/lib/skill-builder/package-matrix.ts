import type { SkillPackageType, WorkflowStageId } from "@/types/skill";

export type RequiredFiles = {
  skillMd: boolean;
  catalogMd: boolean;
  readmeMd: boolean;
  workUnitJson: boolean;
  hooksJson: boolean;
  references: boolean;
  templates: boolean;
  checklists: boolean;
  tests: boolean;
  examples: boolean;
};

export const REQUIRED_FILES_BY_TYPE: Record<SkillPackageType, RequiredFiles> = {
  "simple-skill": {
    skillMd: true,
    catalogMd: false,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: false,
    references: false,
    templates: false,
    checklists: false,
    tests: false,
    examples: false,
  },
  "reference-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: false,
    references: true,
    templates: false,
    checklists: false,
    tests: false,
    examples: false,
  },
  "template-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: false,
    references: false,
    templates: true,
    checklists: false,
    tests: false,
    examples: true,
  },
  "script-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: true,
    references: false,
    templates: false,
    checklists: false,
    tests: false,
    examples: true,
  },
  "asset-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: false,
    references: false,
    templates: false,
    checklists: false,
    tests: false,
    examples: true,
  },
  "full-step-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: true,
    hooksJson: true,
    references: true,
    templates: true,
    checklists: true,
    tests: true,
    examples: true,
  },
  "metadata-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: false,
    workUnitJson: false,
    hooksJson: true,
    references: false,
    templates: false,
    checklists: false,
    tests: false,
    examples: false,
  },
  "test-skill": {
    skillMd: true,
    catalogMd: true,
    readmeMd: true,
    workUnitJson: false,
    hooksJson: false,
    references: false,
    templates: false,
    checklists: true,
    tests: true,
    examples: false,
  },
};

export type StageMetadata = {
  id: WorkflowStageId;
  title: string;
  order: number;
  purpose: string;
  inputs: string[];
  outputs: string[];
  usesTemplates: string[];
  usesReferences: string[];
  usesChecklists: string[];
  exitCriteria: string[];
};

export const STAGE_METADATA: Record<WorkflowStageId, StageMetadata> = {
  "requirement-intake": {
    id: "requirement-intake",
    title: "Requirement Intake",
    order: 1,
    purpose:
      "Capture the product idea, constraints, target users, and success signals before any design work begins.",
    inputs: ["raw product idea", "stakeholder notes", "existing screenshots (optional)"],
    outputs: ["UX brief draft"],
    usesTemplates: ["templates/ux-brief-template.md"],
    usesReferences: [],
    usesChecklists: [],
    exitCriteria: [
      "primary user, primary action, and success metric are explicitly named",
    ],
  },
  "ux-foundation": {
    id: "ux-foundation",
    title: "UX Foundation",
    order: 2,
    purpose:
      "Establish user flows, information architecture, and screen inventory.",
    inputs: ["UX brief"],
    outputs: ["user flow", "screen inventory", "IA outline"],
    usesTemplates: ["templates/ux-brief-template.md"],
    usesReferences: ["references/ux-principles.md"],
    usesChecklists: ["checklists/ux-foundation-checklist.md"],
    exitCriteria: ["each screen has a defined purpose and a primary action"],
  },
  "ui-design-foundation": {
    id: "ui-design-foundation",
    title: "UI Design Foundation",
    order: 3,
    purpose:
      "Define layout, hierarchy, components, and design-system-aware specifications per screen.",
    inputs: ["screen inventory"],
    outputs: ["screen specifications", "component breakdown", "design token draft"],
    usesTemplates: ["templates/screen-spec-template.md"],
    usesReferences: ["references/ui-patterns.md", "references/design-system-rules.md"],
    usesChecklists: ["checklists/ui-design-checklist.md"],
    exitCriteria: ["every screen lists default / empty / loading / error states"],
  },
  "prototype-planning": {
    id: "prototype-planning",
    title: "Prototype Planning",
    order: 4,
    purpose:
      "Plan the prototype build, prefer Figma MCP, and prepare manual Figma instructions when MCP is blocked.",
    inputs: ["screen specifications", "component breakdown"],
    outputs: ["prototype plan", "Figma manual instructions"],
    usesTemplates: [
      "templates/figma-instruction-template.md",
      "templates/cursor-prompt-template.md",
    ],
    usesReferences: [],
    usesChecklists: [],
    exitCriteria: ["a buildable plan exists for both MCP and manual paths"],
  },
  "review-validation": {
    id: "review-validation",
    title: "Review & Validation",
    order: 5,
    purpose:
      "Run UX/UI review, accessibility checks, and sandbox validation before handoff.",
    inputs: ["screen specifications", "prototype plan"],
    outputs: ["review notes", "validation log"],
    usesTemplates: ["templates/design-review-template.md"],
    usesReferences: ["references/accessibility-checklist.md"],
    usesChecklists: ["checklists/ui-design-checklist.md"],
    exitCriteria: [
      "all blocking issues from sandbox-test-scenario are resolved or accepted",
    ],
  },
  handoff: {
    id: "handoff",
    title: "Handoff",
    order: 6,
    purpose:
      "Produce implementation-ready artifacts and release the kit output to engineering.",
    inputs: ["screen specifications", "review notes", "validation log"],
    outputs: ["implementation prompt", "handoff package"],
    usesTemplates: ["templates/cursor-prompt-template.md"],
    usesReferences: [],
    usesChecklists: [
      "checklists/handoff-checklist.md",
      "checklists/release-checklist.md",
    ],
    exitCriteria: ["release-checklist is fully ticked"],
  },
};

export const ALL_STAGES: WorkflowStageId[] = [
  "requirement-intake",
  "ux-foundation",
  "ui-design-foundation",
  "prototype-planning",
  "review-validation",
  "handoff",
];
