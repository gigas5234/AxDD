import type { Bilingual } from "@/lib/i18n/locale";

export type ReferenceSkill = {
  name: string;
  publisher: string;
  installs: string;
  description: Bilingual;
};

// Top skills from skills.sh that informed AxDD's Capability Packs.
export const REFERENCE_SKILLS: ReferenceSkill[] = [
  {
    name: "frontend-design",
    publisher: "anthropics/skills",
    installs: "430K",
    description: {
      en: "UI development guidance from Anthropic.",
      ko: "Anthropic의 UI 개발 가이드.",
    },
  },
  {
    name: "web-design-guidelines",
    publisher: "vercel-labs/agent-skills",
    installs: "329K",
    description: {
      en: "Web design best practices and rules.",
      ko: "웹 디자인 베스트 프랙티스와 규칙.",
    },
  },
  {
    name: "ui-ux-pro-max",
    publisher: "nextlevelbuilder",
    installs: "172K",
    description: {
      en: "Comprehensive UX/UI expertise pack.",
      ko: "포괄적 UX/UI 전문 지식 팩.",
    },
  },
  {
    name: "shadcn",
    publisher: "shadcn/ui",
    installs: "148K",
    description: {
      en: "Component library implementation patterns.",
      ko: "컴포넌트 라이브러리 구현 패턴.",
    },
  },
  {
    name: "sleek-design-mobile-apps",
    publisher: "sleekdotdesign",
    installs: "142K",
    description: {
      en: "Mobile app design patterns and aesthetics.",
      ko: "모바일 앱 디자인 패턴과 미감.",
    },
  },
  {
    name: "extract-design-system",
    publisher: "arvindrk",
    installs: "101K",
    description: {
      en: "Reverse-engineer existing designs into tokens.",
      ko: "기존 디자인을 토큰으로 역공학.",
    },
  },
  {
    name: "design-taste-frontend",
    publisher: "leonxlnx/taste-skill",
    installs: "63K",
    description: {
      en: "Frontend aesthetic principles.",
      ko: "프론트엔드 미감 원칙.",
    },
  },
  {
    name: "theme-factory",
    publisher: "anthropics/skills",
    installs: "43K",
    description: {
      en: "Design system generation.",
      ko: "디자인 시스템 생성.",
    },
  },
];

export const SKILLS_SH_URL = "https://www.skills.sh/";
