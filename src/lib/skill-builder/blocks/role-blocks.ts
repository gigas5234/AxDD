import type { RoleLevel, SkillBlock } from "@/types/skill";

const ROLE_LEVEL_DESCRIPTIONS: Record<RoleLevel, string> = {
  junior:
    "A junior UX/UI designer who is learning to translate product requirements into screens.",
  mid:
    "A mid-level UX/UI designer comfortable owning the structure of small to medium product surfaces.",
  senior:
    "A senior UX/UI designer with frontend implementation awareness, capable of owning end-to-end product surfaces.",
  expert:
    "An expert UX/UI designer who leads design systems, mentors teams, and partners with engineering leadership.",
};

export function roleBlock(level: RoleLevel, domainFocus: string[]): SkillBlock {
  const focus = domainFocus.length > 0 ? domainFocus.join(", ") : "general product surfaces";
  return {
    id: `role-${level}`,
    category: "role",
    title: `Role — ${level}`,
    description: "Role profile used in SKILL.md",
    content: `${ROLE_LEVEL_DESCRIPTIONS[level]}\n\nFocus areas: ${focus}.`,
  };
}

export function roleAwarenessLines(opts: {
  implementationAwareness: boolean;
  designSystemAwareness: boolean;
  businessAwareness: boolean;
}): string[] {
  const lines: string[] = [];
  if (opts.implementationAwareness)
    lines.push("Considers frontend implementation constraints when proposing UI.");
  if (opts.designSystemAwareness)
    lines.push("Speaks in tokens, primitives, and component variants — not one-off styles.");
  if (opts.businessAwareness)
    lines.push("Weighs business goals, KPIs, and user value alongside aesthetics.");
  return lines;
}
