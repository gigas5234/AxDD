import type { QualityRule, SkillBlock } from "@/types/skill";

const RULE_TEXT: Record<QualityRule, string> = {
  "avoid-vague-language":
    "Do not use vague words like modern, clean, intuitive, or premium without concrete design rules.",
  "define-primary-action": "Always define the primary user action on every screen.",
  "include-information-hierarchy":
    "Always rank content priority and produce an information hierarchy.",
  "include-screen-states":
    "Always specify default, empty, loading, and error states for every screen.",
  "componentize-output": "Always break screens into reusable, named components.",
  "include-responsive-notes":
    "Always include responsive notes covering mobile, tablet, and desktop breakpoints.",
  "include-accessibility":
    "Always include accessibility considerations (contrast, focus, semantics).",
  "avoid-unnecessary-questions":
    "Do not ask the user for information that can be reasonably inferred from context.",
  "avoid-overlong-chat-response":
    "Do not produce a sprawling chat response when a tight, structured answer would do.",
};

export function ruleBlocks(rules: QualityRule[]): SkillBlock[] {
  return rules.map((r) => ({
    id: `rule-${r}`,
    category: "rule",
    title: r,
    description: "Quality rule",
    content: RULE_TEXT[r],
  }));
}

export function ruleLines(rules: QualityRule[]): string[] {
  return rules.map((r) => `- ${RULE_TEXT[r]}`);
}
