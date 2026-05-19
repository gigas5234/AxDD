import type { SkillCategory } from "@/types/skill";

export type CategoryDescriptor = {
  id: SkillCategory;
  label: string;
  shortDescription: string;
  status: "available" | "coming-soon";
};

export const CATEGORY_REGISTRY: CategoryDescriptor[] = [
  {
    id: "ux-ui",
    label: "UX/UI Designer",
    shortDescription:
      "Turn product ideas, requirements, or screenshots into UX strategy, screen specs, and implementation prompts.",
    status: "available",
  },
  {
    id: "product",
    label: "Product Planner",
    shortDescription: "Plan features, scope, and milestones with AI assistance.",
    status: "coming-soon",
  },
  {
    id: "frontend",
    label: "Frontend Implementation",
    shortDescription: "Translate specs and design tokens into shippable frontend code.",
    status: "coming-soon",
  },
  {
    id: "design-system",
    label: "Design System Generator",
    shortDescription: "Generate tokens, primitives, and component rules from a brand direction.",
    status: "coming-soon",
  },
  {
    id: "research",
    label: "Research Assistant",
    shortDescription: "Survey topics, summarize sources, and produce structured research briefs.",
    status: "coming-soon",
  },
  {
    id: "content",
    label: "Content Planner",
    shortDescription: "Plan content calendars, briefs, and copy with brand-aware structure.",
    status: "coming-soon",
  },
  {
    id: "data",
    label: "Data Analysis",
    shortDescription: "Explore datasets, generate hypotheses, and produce analytical narratives.",
    status: "coming-soon",
  },
];

export function getCategory(id: SkillCategory): CategoryDescriptor | undefined {
  return CATEGORY_REGISTRY.find((c) => c.id === id);
}
