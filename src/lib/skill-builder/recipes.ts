import type {
  AnswerStyle,
  CapabilityPack,
  SkillConfig,
  WorkflowModule,
} from "@/types/skill";
import type { Bilingual } from "@/lib/i18n/locale";

export type Recipe = {
  id: string;
  name: Bilingual;
  goal: Bilingual;
  capabilityPacks: CapabilityPack[];
  workflowModules: WorkflowModule[];
  answerStyle?: AnswerStyle;
};

const ALL_WORKFLOWS: WorkflowModule[] = [
  "problem-definition",
  "user-flow",
  "information-architecture",
  "screen-design",
  "component-breakdown",
  "design-system-draft",
  "figma-to-code",
  "ux-review",
  "accessibility-check",
  "implementation-prompt",
];

export const RECIPES: Recipe[] = [
  {
    id: "web-saas",
    name: { en: "Web SaaS Designer", ko: "웹 SaaS 디자이너" },
    goal: {
      en: "Data-dense desktop surfaces with consistent tokens and Tailwind output.",
      ko: "토큰이 일관된 데이터 집약 데스크톱 화면, Tailwind 출력 기준.",
    },
    capabilityPacks: [
      "design-taste",
      "web-best-practices",
      "tailwind-first",
      "theme-factory",
    ],
    workflowModules: [
      "problem-definition",
      "user-flow",
      "information-architecture",
      "screen-design",
      "component-breakdown",
      "design-system-draft",
      "implementation-prompt",
    ],
    answerStyle: "structured",
  },
  {
    id: "mobile-app",
    name: { en: "Mobile App Designer", ko: "모바일 앱 디자이너" },
    goal: {
      en: "Mobile-first product surfaces with native patterns and shadcn primitives.",
      ko: "네이티브 패턴 + shadcn 프리미티브 중심의 모바일 화면.",
    },
    capabilityPacks: [
      "design-taste",
      "mobile-patterns",
      "shadcn-affinity",
      "tailwind-first",
    ],
    workflowModules: [
      "problem-definition",
      "user-flow",
      "screen-design",
      "component-breakdown",
      "accessibility-check",
      "implementation-prompt",
    ],
    answerStyle: "structured",
  },
  {
    id: "design-system-builder",
    name: { en: "Design System Builder", ko: "디자인 시스템 빌더" },
    goal: {
      en: "Build tokens, primitives, and visual composition rules from scratch.",
      ko: "토큰·프리미티브·시각 구성 규칙을 처음부터 설계.",
    },
    capabilityPacks: [
      "design-taste",
      "theme-factory",
      "visual-composition",
      "tailwind-first",
    ],
    workflowModules: [
      "design-system-draft",
      "component-breakdown",
      "implementation-prompt",
    ],
    answerStyle: "detailed",
  },
  {
    id: "ux-reviewer",
    name: { en: "UX Reviewer", ko: "UX 리뷰어" },
    goal: {
      en: "Audit existing screens, extract their implicit system, and prioritize fixes.",
      ko: "기존 화면 감사 + 묵시적 시스템 추출 + 수정 우선순위 결정.",
    },
    capabilityPacks: [
      "design-taste",
      "extract-design-system",
      "web-best-practices",
    ],
    workflowModules: [
      "ux-review",
      "accessibility-check",
      "component-breakdown",
    ],
    answerStyle: "concise",
  },
  {
    id: "figma-to-code",
    name: { en: "Figma → Code Converter", ko: "Figma → 코드 변환" },
    goal: {
      en: "Turn screenshots or Figma frames into shadcn + Tailwind implementations.",
      ko: "스크린샷·Figma 프레임을 shadcn + Tailwind 구현으로 변환.",
    },
    capabilityPacks: [
      "design-taste",
      "tailwind-first",
      "shadcn-affinity",
      "web-best-practices",
    ],
    workflowModules: [
      "component-breakdown",
      "figma-to-code",
      "implementation-prompt",
    ],
    answerStyle: "structured",
  },
];

export function applyRecipeToConfig(
  recipe: Recipe,
  base: SkillConfig,
): SkillConfig {
  return {
    ...base,
    capabilityPacks: [...recipe.capabilityPacks],
    workflowModules: [...recipe.workflowModules],
    outputFormat: {
      ...base.outputFormat,
      answerStyle: recipe.answerStyle ?? base.outputFormat.answerStyle,
    },
    updatedAt: new Date().toISOString(),
  };
}

// Re-export so the builder can highlight when a recipe matches current config
export function findMatchingRecipeId(config: SkillConfig): string | null {
  for (const r of RECIPES) {
    const samePacks =
      r.capabilityPacks.length === config.capabilityPacks.length &&
      r.capabilityPacks.every((p) => config.capabilityPacks.includes(p));
    const sameWorkflows =
      r.workflowModules.length === config.workflowModules.length &&
      r.workflowModules.every((w) => config.workflowModules.includes(w));
    if (samePacks && sameWorkflows) return r.id;
  }
  return null;
}

// Silence unused warning if ALL_WORKFLOWS is unused externally
void ALL_WORKFLOWS;
