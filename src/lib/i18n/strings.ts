import type { Bilingual } from "./locale";
import type {
  AnswerStyle,
  CapabilityPack,
  QualityRule,
  RoleLevel,
  SkillCategory,
  TranslationMode,
  WorkflowModule,
} from "@/types/skill";

// ─────────────────────────────────────────────────────────────────────────────
// Global UI strings
// ─────────────────────────────────────────────────────────────────────────────

export const UI = {
  brand: {
    en: "AxDD Skill Builder",
    ko: "AxDD 스킬 빌더",
  } as Bilingual,

  // Global nav top-row category labels
  navUxUi: { en: "UX/UI", ko: "UX/UI" } as Bilingual,
  navProduct: { en: "Product", ko: "프로덕트" } as Bilingual,
  navFrontend: { en: "Frontend", ko: "프론트엔드" } as Bilingual,
  navDesignSystem: { en: "Design System", ko: "디자인 시스템" } as Bilingual,

  // Sub-nav
  category: { en: "Category", ko: "카테고리" } as Bilingual,
  preset: { en: "Preset", ko: "프리셋" } as Bilingual,
  generate: { en: "Generate Skill Package", ko: "스킬 패키지 생성" } as Bilingual,
  generating: { en: "Generating…", ko: "생성 중…" } as Bilingual,
  comingSoon: { en: "Soon", ko: "예정" } as Bilingual,

  // Quick bar
  qbGenerate: { en: "Generate", ko: "생성" } as Bilingual,
  qbRegenerate: { en: "Re-generate", ko: "다시 생성" } as Bilingual,
  qbReset: { en: "Reset", ko: "초기화" } as Bilingual,
  qbResetTitle: {
    en: "Restore settings from the current preset's defaults",
    ko: "현재 프리셋의 기본값으로 설정을 되돌립니다",
  } as Bilingual,

  // Panel labels (uppercase chips)
  panelDetailedSettings: { en: "Detailed settings", ko: "상세 설정" } as Bilingual,
  panelFiles: { en: "Files", ko: "파일" } as Bilingual,
  panelQualityDetails: { en: "Quality details", ko: "품질 상세" } as Bilingual,
  panelCapabilityPack: { en: "Capability Pack", ko: "능력 팩" } as Bilingual,
  panelQuality: { en: "Quality", ko: "품질" } as Bilingual,

  // Preview header
  previewTabPreview: { en: "Preview", ko: "미리보기" } as Bilingual,
  previewTabRaw: { en: "Raw", ko: "원본" } as Bilingual,
  previewTabKorean: { en: "Korean", ko: "한국어" } as Bilingual,
  previewEmptyHint: {
    en: "Generate a package and select a file.",
    ko: "패키지를 생성하고 파일을 선택하세요.",
  } as Bilingual,
  emptyHeroTitle: {
    en: "Choose a preset and generate your first skill package.",
    ko: "프리셋을 선택하고 첫 스킬 패키지를 생성하세요.",
  } as Bilingual,
  emptyHeroBody: {
    en: "The file tree, preview, and quality score appear here once the package is generated.",
    ko: "패키지를 생성하면 파일 트리, 미리보기, 품질 점수가 여기에 표시됩니다.",
  } as Bilingual,
  edited: { en: "edited", ko: "편집됨" } as Bilingual,
  lastGenerated: { en: "Last generated", ko: "마지막 생성" } as Bilingual,

  // Footer buttons in preview area
  btnKoreanPreview: { en: "Korean Preview", ko: "한국어 미리보기" } as Bilingual,
  btnKoreanPreviewTitle: {
    en: "Korean preview is available after AI integration (Phase 2).",
    ko: "한국어 미리보기는 AI 연동(Phase 2) 이후 제공됩니다.",
  } as Bilingual,
  btnRegenerateFile: { en: "Regenerate File", ko: "파일 재생성" } as Bilingual,
  btnRegenerateFileTitle: {
    en: "Regenerate this file deterministically from the current config.",
    ko: "현재 설정으로 이 파일을 결정론적으로 재생성합니다.",
  } as Bilingual,

  // Korean preview placeholder body
  koPreviewLine1: {
    en: "Korean preview will be available once AI translation is wired in. The MVP keeps it off to minimize token usage.",
    ko: "한글 미리보기는 AI 번역 단계가 연결된 이후에 제공됩니다. MVP에서는 토큰 사용량을 줄이기 위해 비활성화되어 있습니다.",
  } as Bilingual,
  koPreviewLine2: {
    en: "Korean preview is generated on demand to reduce token usage. Available in Phase 2 (AI Assist).",
    ko: "토큰 사용량을 줄이기 위해 한글 미리보기는 필요할 때만 생성됩니다. Phase 2(AI Assist)에서 제공 예정.",
  } as Bilingual,

  // File tree empty
  fileTreeEmpty: {
    en: "Generate a package to see the file tree.",
    ko: "패키지를 생성하면 파일 트리가 표시됩니다.",
  } as Bilingual,
  fileEditedTitle: { en: "Edited", ko: "편집됨" } as Bilingual,

  // Inspector strings
  inspEnabled: {
    en: "Enabled — click to disable",
    ko: "활성화됨 — 클릭하여 비활성화",
  } as Bilingual,
  inspEnable: { en: "Enable this pack", ko: "이 팩 활성화" } as Bilingual,
  inspWhenEnabled: { en: "When enabled, adds", ko: "활성화 시 추가됨" } as Bilingual,
  inspInspiredBy: { en: "Inspired by", ko: "참고" } as Bilingual,
  inspSkillMdPreview: {
    en: "SKILL.md section preview",
    ko: "SKILL.md 섹션 미리보기",
  } as Bilingual,
  inspReferencePreview: {
    en: "Reference file preview",
    ko: "참조 파일 미리보기",
  } as Bilingual,
  inspCloseTitle: { en: "Close (Esc)", ko: "닫기 (Esc)" } as Bilingual,
  inspLabelFile: { en: "file", ko: "파일" } as Bilingual,
  inspLabelSection: { en: "section", ko: "섹션" } as Bilingual,
  inspLabelRule: { en: "rule", ko: "규칙" } as Bilingual,
  inspPackNotFound: { en: "Pack not found.", ko: "팩을 찾을 수 없습니다." } as Bilingual,
  inspClickPackHint: {
    en: "Click a card to see its full effect on the right.",
    ko: "카드를 클릭하면 오른쪽에 효과가 전부 표시됩니다.",
  } as Bilingual,
  inspShowDetails: {
    en: "Show details on the right",
    ko: "오른쪽에 상세 표시",
  } as Bilingual,

  // Quality footer
  qfWarnings: { en: "warnings", ko: "경고" } as Bilingual,
  qfWarning: { en: "warning", ko: "경고" } as Bilingual,
  qfShown: { en: "shown", ko: "표시 중" } as Bilingual,
  qfDetails: { en: "details", ko: "상세" } as Bilingual,
  qfDownload: { en: "Download ZIP", ko: "ZIP 다운로드" } as Bilingual,
  qfDownloading: { en: "Preparing ZIP…", ko: "ZIP 준비 중…" } as Bilingual,
  qfOpenDetails: {
    en: "Open quality details",
    ko: "품질 상세 열기",
  } as Bilingual,

  // Quality panel
  qpEmpty: {
    en: "Generate a package to see its quality report.",
    ko: "패키지를 생성하면 품질 리포트가 표시됩니다.",
  } as Bilingual,
  qpScore: { en: "Quality score", ko: "품질 점수" } as Bilingual,
  qpChecks: { en: "Checks", ko: "체크" } as Bilingual,
  qpWarningsLabel: { en: "Warnings", ko: "경고" } as Bilingual,
  qpSuggestions: { en: "Suggestions", ko: "제안" } as Bilingual,

  // Settings section titles
  secBasic: { en: "1. Basic Info", ko: "1. 기본 정보" } as Bilingual,
  secRole: { en: "2. Role Profile", ko: "2. 역할 프로필" } as Bilingual,
  secWorkflow: { en: "3. Workflow Modules", ko: "3. 워크플로 모듈" } as Bilingual,
  secPacks: { en: "4. Capability Packs", ko: "4. 능력 팩" } as Bilingual,
  secOutput: { en: "5. Output Format", ko: "5. 출력 형식" } as Bilingual,
  secRules: { en: "6. Quality Rules", ko: "6. 품질 규칙" } as Bilingual,
  secLanguage: { en: "7. Language", ko: "7. 언어" } as Bilingual,
  secPackage: { en: "8. Package Options", ko: "8. 패키지 옵션" } as Bilingual,

  // Pack section intro
  packsIntro: {
    en: "Optional skill flavors. Click a card to see its full effect on the right.",
    ko: "선택형 스킬 옵션. 카드를 클릭하면 오른쪽에 효과가 자세히 표시됩니다.",
  } as Bilingual,

  // Settings field labels
  fldSkillName: { en: "Skill name", ko: "스킬 이름" } as Bilingual,
  fldPackageName: { en: "Package name", ko: "패키지 이름" } as Bilingual,
  fldDescription: { en: "Description", ko: "설명" } as Bilingual,
  fldTargetAgent: { en: "Target agent", ko: "타겟 에이전트" } as Bilingual,
  fldRoleLevel: { en: "Role level", ko: "역할 레벨" } as Bilingual,
  fldDomainFocus: {
    en: "Domain focus (comma separated)",
    ko: "도메인 영역 (쉼표로 구분)",
  } as Bilingual,
  fldImplAware: { en: "Implementation awareness", ko: "구현 인지" } as Bilingual,
  fldDsAware: { en: "Design system awareness", ko: "디자인 시스템 인지" } as Bilingual,
  fldBizAware: { en: "Business awareness", ko: "비즈니스 인지" } as Bilingual,
  fldAnswerStyle: { en: "Answer style", ko: "답변 스타일" } as Bilingual,
  fldIncludeMd: { en: "Include Markdown", ko: "마크다운 포함" } as Bilingual,
  fldIncludeJson: { en: "Include JSON", ko: "JSON 포함" } as Bilingual,
  fldIncludeTables: { en: "Include tables", ko: "테이블 포함" } as Bilingual,
  fldIncludeCursor: { en: "Include Cursor prompt", ko: "Cursor 프롬프트 포함" } as Bilingual,
  fldIncludeChecks: { en: "Include checklists", ko: "체크리스트 포함" } as Bilingual,
  fldIncludeExamples: { en: "Include examples", ko: "예시 포함" } as Bilingual,
  fldPrimaryLang: { en: "Primary language", ko: "기본 언어" } as Bilingual,
  fldTranslationMode: { en: "Translation mode", ko: "번역 모드" } as Bilingual,
  fldGenKoDefault: {
    en: "Generate Korean by default",
    ko: "기본 한국어 생성",
  } as Bilingual,
  fldTranslationHint: {
    en: "Korean translation is mocked in the MVP — see Korean tab in the preview.",
    ko: "MVP에서 한국어 번역은 비활성 상태입니다 — 미리보기의 한국어 탭 참고.",
  } as Bilingual,
  fldIncSkillMd: { en: "Include SKILL.md", ko: "SKILL.md 포함" } as Bilingual,
  fldIncReadme: { en: "Include README.md", ko: "README.md 포함" } as Bilingual,
  fldIncReferences: { en: "Include references/", ko: "references/ 포함" } as Bilingual,
  fldIncTemplates: { en: "Include templates/", ko: "templates/ 포함" } as Bilingual,
  fldIncExamples: { en: "Include examples/", ko: "examples/ 포함" } as Bilingual,

  // Language value labels
  langEnglish: { en: "English", ko: "영어" } as Bilingual,
  langKorean: { en: "Korean", ko: "한국어" } as Bilingual,

  // Recommendations on empty state
  recipesTitle: {
    en: "Recommended starting points",
    ko: "추천 시작점",
  } as Bilingual,
  recipesIntro: {
    en: "Click a recipe to apply its Capability Packs and workflow modules to your current settings. Fine-tune from the left panel, then press Generate.",
    ko: "레시피를 클릭하면 현재 설정에 해당 Capability Pack과 워크플로가 적용됩니다. 좌측에서 세부 조정 후 생성을 눌러주세요.",
  } as Bilingual,
  recipeApply: { en: "Apply this recipe", ko: "이 레시피 적용" } as Bilingual,
  recipeApplied: { en: "Applied ✓", ko: "적용됨 ✓" } as Bilingual,
  recipePacksLabel: { en: "Packs", ko: "팩" } as Bilingual,
  recipeWorkflowsLabel: { en: "Workflow", ko: "워크플로" } as Bilingual,
  recipeStyleLabel: { en: "Style", ko: "스타일" } as Bilingual,
  refSkillsTitle: { en: "Reference skills", ko: "참고 스킬" } as Bilingual,
  refSkillsIntro: {
    en: "Top installed skills on skills.sh that informed AxDD's Capability Packs.",
    ko: "AxDD의 Capability Pack에 영감을 준 skills.sh의 인기 스킬들.",
  } as Bilingual,
  refInstalls: { en: "installs", ko: "설치" } as Bilingual,
  refSeeMore: { en: "Browse more on skills.sh →", ko: "skills.sh에서 더 보기 →" } as Bilingual,
};

// ─────────────────────────────────────────────────────────────────────────────
// Enum / option label maps
// ─────────────────────────────────────────────────────────────────────────────

export const ROLE_LEVEL_LABELS: Record<RoleLevel, Bilingual> = {
  junior: { en: "junior", ko: "주니어" },
  mid: { en: "mid", ko: "미드" },
  senior: { en: "senior", ko: "시니어" },
  expert: { en: "expert", ko: "엑스퍼트" },
};

export const ANSWER_STYLE_LABELS: Record<AnswerStyle, Bilingual> = {
  concise: { en: "concise", ko: "간결" },
  structured: { en: "structured", ko: "구조화" },
  detailed: { en: "detailed", ko: "상세" },
};

export const TRANSLATION_MODE_LABELS: Record<TranslationMode, Bilingual> = {
  none: { en: "none", ko: "사용 안 함" },
  "on-demand": { en: "on-demand", ko: "요청 시" },
  "side-by-side": { en: "side-by-side", ko: "병행 표시" },
  cached: { en: "cached", ko: "캐시" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Workflow / Rule / Category / Pack / Preset label maps
// ─────────────────────────────────────────────────────────────────────────────

export const WORKFLOW_LABELS: Record<WorkflowModule, Bilingual> = {
  "problem-definition": { en: "Problem Definition", ko: "문제 정의" },
  "user-flow": { en: "User Flow", ko: "사용자 흐름" },
  "information-architecture": {
    en: "Information Architecture",
    ko: "정보 구조",
  },
  "screen-design": { en: "Screen Design", ko: "화면 설계" },
  "component-breakdown": { en: "Component Breakdown", ko: "컴포넌트 분해" },
  "design-system-draft": { en: "Design System Draft", ko: "디자인 시스템 초안" },
  "figma-to-code": { en: "Figma to Code", ko: "Figma to 코드" },
  "ux-review": { en: "UX Review", ko: "UX 리뷰" },
  "accessibility-check": { en: "Accessibility Check", ko: "접근성 점검" },
  "implementation-prompt": {
    en: "Implementation Prompt",
    ko: "구현 프롬프트",
  },
};

export const QUALITY_LABELS: Record<QualityRule, Bilingual> = {
  "avoid-vague-language": { en: "Avoid vague language", ko: "모호한 표현 회피" },
  "define-primary-action": { en: "Define primary action", ko: "주요 액션 정의" },
  "include-information-hierarchy": {
    en: "Include information hierarchy",
    ko: "정보 위계 포함",
  },
  "include-screen-states": { en: "Include screen states", ko: "화면 상태 포함" },
  "componentize-output": { en: "Componentize output", ko: "컴포넌트 단위 출력" },
  "include-responsive-notes": {
    en: "Include responsive notes",
    ko: "반응형 노트 포함",
  },
  "include-accessibility": { en: "Include accessibility", ko: "접근성 포함" },
  "avoid-unnecessary-questions": {
    en: "Avoid unnecessary questions",
    ko: "불필요한 질문 회피",
  },
  "avoid-overlong-chat-response": {
    en: "Avoid overlong chat responses",
    ko: "장황한 응답 회피",
  },
};

export const CATEGORY_LABELS: Record<
  SkillCategory,
  { label: Bilingual; shortDescription: Bilingual }
> = {
  "ux-ui": {
    label: { en: "UX/UI Designer", ko: "UX/UI 디자이너" },
    shortDescription: {
      en: "Turn product ideas, requirements, or screenshots into UX strategy, screen specs, and implementation prompts.",
      ko: "제품 아이디어·요구사항·스크린샷을 UX 전략, 화면 명세, 구현 프롬프트로 변환합니다.",
    },
  },
  product: {
    label: { en: "Product Planner", ko: "프로덕트 기획자" },
    shortDescription: {
      en: "Plan features, scope, and milestones with AI assistance.",
      ko: "AI의 도움으로 기능·범위·마일스톤을 기획합니다.",
    },
  },
  frontend: {
    label: { en: "Frontend Implementation", ko: "프론트엔드 구현" },
    shortDescription: {
      en: "Translate specs and design tokens into shippable frontend code.",
      ko: "명세와 디자인 토큰을 배포 가능한 프론트엔드 코드로 변환합니다.",
    },
  },
  "design-system": {
    label: { en: "Design System Generator", ko: "디자인 시스템 생성" },
    shortDescription: {
      en: "Generate tokens, primitives, and component rules from a brand direction.",
      ko: "브랜드 방향성에서 토큰·프리미티브·컴포넌트 규칙을 생성합니다.",
    },
  },
  research: {
    label: { en: "Research Assistant", ko: "리서치 어시스턴트" },
    shortDescription: {
      en: "Survey topics, summarize sources, and produce structured research briefs.",
      ko: "주제를 조사하고 출처를 요약하여 구조화된 리서치 브리프를 작성합니다.",
    },
  },
  content: {
    label: { en: "Content Planner", ko: "콘텐츠 기획자" },
    shortDescription: {
      en: "Plan content calendars, briefs, and copy with brand-aware structure.",
      ko: "브랜드를 인식한 구조로 콘텐츠 캘린더·브리프·카피를 기획합니다.",
    },
  },
  data: {
    label: { en: "Data Analysis", ko: "데이터 분석" },
    shortDescription: {
      en: "Explore datasets, generate hypotheses, and produce analytical narratives.",
      ko: "데이터셋을 탐색하고 가설을 세워 분석 결과를 정리합니다.",
    },
  },
};

export const PACK_LABELS: Record<
  CapabilityPack,
  { label: Bilingual; summary: Bilingual }
> = {
  "design-taste": {
    label: { en: "Design Taste", ko: "디자인 감각" },
    summary: {
      en: "Opinionated aesthetic — restraint, hierarchy via size/weight, single accent, measurable rules.",
      ko: "주관적 미감 — 절제, 크기·굵기로 위계, 단일 강조색, 측정 가능한 규칙.",
    },
  },
  "web-best-practices": {
    label: { en: "Web Best Practices", ko: "웹 베스트 프랙티스" },
    summary: {
      en: "Responsive grids, fluid type, touch targets, layout shift, and loading patterns for the web.",
      ko: "반응형 그리드, 유동 타이포, 터치 영역, 레이아웃 시프트, 로딩 패턴 등 웹 표준.",
    },
  },
  "theme-factory": {
    label: { en: "Theme Factory", ko: "테마 팩토리" },
    summary: {
      en: "Generate a complete design token JSON (color, typography, spacing, radius) alongside specs.",
      ko: "명세와 함께 완전한 디자인 토큰 JSON(색·타이포·간격·라디우스)을 생성합니다.",
    },
  },
  "tailwind-first": {
    label: { en: "Tailwind-First Output", ko: "Tailwind 우선 출력" },
    summary: {
      en: "All implementation outputs use Tailwind utility classes; tokens map to Tailwind theme keys.",
      ko: "모든 구현 산출물은 Tailwind 유틸리티 클래스, 토큰은 Tailwind 테마 키로 매핑됩니다.",
    },
  },
  "shadcn-affinity": {
    label: { en: "shadcn/ui Affinity", ko: "shadcn/ui 친화성" },
    summary: {
      en: "Prefer shadcn/ui primitives when designing components; map specs to existing shadcn parts.",
      ko: "컴포넌트 설계 시 shadcn/ui 프리미티브를 우선 사용하고 기존 부품에 매핑합니다.",
    },
  },
  "mobile-patterns": {
    label: { en: "Mobile Patterns", ko: "모바일 패턴" },
    summary: {
      en: "Bottom sheets, swipe actions, pull-to-refresh, safe-area, haptics — mobile-native patterns.",
      ko: "바텀시트·스와이프 액션·풀투리프레시·세이프에어리어·햅틱 등 모바일 네이티브 패턴.",
    },
  },
  "extract-design-system": {
    label: { en: "Extract Existing System", ko: "기존 시스템 추출" },
    summary: {
      en: "Reverse-engineer an existing screen or codebase into tokens, primitives, and component rules.",
      ko: "기존 화면이나 코드베이스를 토큰·프리미티브·컴포넌트 규칙으로 역공학합니다.",
    },
  },
  "visual-composition": {
    label: { en: "Visual Composition", ko: "비주얼 구성" },
    summary: {
      en: "Gestalt principles, optical alignment, grid systems, visual rhythm — pure composition rules.",
      ko: "게슈탈트 원리·광학적 정렬·그리드·시각적 리듬 등 순수 구성 규칙.",
    },
  },
};

export const PRESET_LABELS: Record<
  string,
  { name: Bilingual; bestFor: Bilingual }
> = {
  "ux-ui-axdd-default": {
    name: {
      en: "UX/UI Designer — AxDD Default",
      ko: "UX/UI 디자이너 — AxDD 기본",
    },
    bestFor: {
      en: "Turning rough service ideas into UX structures, screens, and implementation prompts.",
      ko: "거친 서비스 아이디어를 UX 구조·화면·구현 프롬프트로 변환합니다.",
    },
  },
  "figma-to-code-helper": {
    name: { en: "Figma to Code Helper", ko: "Figma to 코드 도우미" },
    bestFor: {
      en: "Turning screenshots, Figma descriptions, or UI references into React/Tailwind implementation plans.",
      ko: "스크린샷·Figma 설명·UI 레퍼런스를 React/Tailwind 구현 계획으로 변환합니다.",
    },
  },
  "design-system-starter": {
    name: { en: "Design System Starter", ko: "디자인 시스템 스타터" },
    bestFor: {
      en: "Creating design tokens and component rules from a product direction or visual style.",
      ko: "제품 방향성·비주얼 스타일에서 디자인 토큰과 컴포넌트 규칙을 만듭니다.",
    },
  },
  "ux-review-assistant": {
    name: { en: "UX Review Assistant", ko: "UX 리뷰 어시스턴트" },
    bestFor: {
      en: "Reviewing existing screens and finding UX/UI issues.",
      ko: "기존 화면을 검토해 UX/UI 이슈를 찾아냅니다.",
    },
  },
};
