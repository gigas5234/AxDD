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

  // Intent input / AI recommendation
  intentHeroTitle: {
    en: "What do you want to build?",
    ko: "무엇을 만들고 싶으세요?",
  } as Bilingual,
  intentHeroSubtitle: {
    en: "Type freely — we match the closest skills from the catalog and recommend a starting configuration.",
    ko: "자유롭게 입력하면 카탈로그에서 가장 가까운 스킬을 찾아 추천해드립니다.",
  } as Bilingual,
  intentPlaceholder: {
    en: "e.g., design a fintech onboarding screen / implement a React component",
    ko: "예: 핀테크 온보딩 화면 설계 / React 컴포넌트 구현",
  } as Bilingual,
  intentSubmit: { en: "Recommend", ko: "추천 받기" } as Bilingual,
  intentExamplesLabel: { en: "Try", ko: "예시" } as Bilingual,
  intentNote: {
    en: "Keyword matching today. AI semantic matching coming in Phase 2.",
    ko: "현재는 키워드 매칭입니다. AI 의미 검색은 Phase 2에서 제공 예정.",
  } as Bilingual,
  orPickRecipe: {
    en: "Or pick a starting point",
    ko: "또는 시작점에서 선택",
  } as Bilingual,

  recHeader: {
    en: "Recommendations for",
    ko: "이 입력에 대한 추천",
  } as Bilingual,
  recCategory: { en: "Category", ko: "카테고리" } as Bilingual,
  recRecipe: { en: "Recipe", ko: "레시피" } as Bilingual,
  recPacks: { en: "Capability Packs", ko: "능력 팩" } as Bilingual,
  recWorkflows: { en: "Workflow Modules", ko: "워크플로 모듈" } as Bilingual,
  recMatched: { en: "matched", ko: "일치" } as Bilingual,
  recApplyAll: { en: "Apply all suggestions", ko: "모두 적용" } as Bilingual,
  recDismiss: { en: "Dismiss", ko: "닫기" } as Bilingual,
  recNoMatch: {
    en: "No matches found. Try different keywords or pick a recipe below.",
    ko: "일치 항목이 없습니다. 다른 키워드를 시도하거나 아래 레시피에서 선택해 주세요.",
  } as Bilingual,

  // Dependencies
  depsUnmet: { en: "Has unmet dependency", ko: "의존성 미충족" } as Bilingual,
  depsTitle: { en: "Dependencies", ko: "의존성" } as Bilingual,
  depsRequires: { en: "Requires", ko: "필요" } as Bilingual,
  depsEnable: { en: "Enable", ko: "활성화" } as Bilingual,
  depsMet: { en: "Enabled ✓", ko: "활성화됨 ✓" } as Bilingual,

  // Simulator
  simTab: { en: "Simulate", ko: "시뮬레이션" } as Bilingual,
  simTitle: { en: "Skill Simulator", ko: "스킬 시뮬레이터" } as Bilingual,
  simSubtitle: {
    en: "Type a fictional user input. See how this skill would route and what it would emit — before installing.",
    ko: "가상의 사용자 입력을 적어주세요. 설치하기 전에 이 스킬이 어떻게 동작할지 미리 봅니다.",
  } as Bilingual,
  simPlaceholder: {
    en: "e.g., Design an order status screen for a food delivery app.",
    ko: "예: 음식 배달 앱의 주문 상태 화면을 설계해줘.",
  } as Bilingual,
  simRun: { en: "Run simulation", ko: "시뮬레이션 실행" } as Bilingual,
  simRequiresPackage: {
    en: "Generate a package first to enable simulation.",
    ko: "시뮬레이션을 사용하려면 먼저 패키지를 생성하세요.",
  } as Bilingual,
  simTriage: { en: "Triage decision", ko: "트리아지 판단" } as Bilingual,
  simPipeline: { en: "Pipeline", ko: "파이프라인" } as Bilingual,
  simSkipped: {
    en: "Triage suggested these but the config does not enable them",
    ko: "트리아지가 추천했지만 현재 설정에 없음",
  } as Bilingual,
  simStepOutput: { en: "Required output shape", ko: "필수 출력 형태" } as Bilingual,
  simStepReferences: { en: "References loaded", ko: "참조 파일" } as Bilingual,
  simStepStop: { en: "STOP gates", ko: "STOP 게이트" } as Bilingual,
  simStopWillTrigger: {
    en: "Likely to trigger — agent will pause and ask",
    ko: "발동 가능 — 에이전트가 멈추고 질문할 가능성",
  } as Bilingual,
  simAllPass: {
    en: "All STOP gates pass with this input.",
    ko: "이 입력에서 STOP 게이트가 모두 통과합니다.",
  } as Bilingual,
  simNoMatch: {
    en: "No workflow matched. Defaulting to the category's standard pipeline.",
    ko: "매칭된 워크플로 없음. 카테고리의 기본 파이프라인으로 진행.",
  } as Bilingual,
  simTokenCost: {
    en: "Approx. SKILL.md context cost",
    ko: "SKILL.md 컨텍스트 비용(추정)",
  } as Bilingual,
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
  // UX/UI
  "problem-definition": { en: "Problem Definition", ko: "문제 정의" },
  "user-flow": { en: "User Flow", ko: "사용자 흐름" },
  "information-architecture": { en: "Information Architecture", ko: "정보 구조" },
  "screen-design": { en: "Screen Design", ko: "화면 설계" },
  "component-breakdown": { en: "Component Breakdown", ko: "컴포넌트 분해" },
  "design-system-draft": { en: "Design System Draft", ko: "디자인 시스템 초안" },
  "figma-to-code": { en: "Figma to Code", ko: "Figma to 코드" },
  "ux-review": { en: "UX Review", ko: "UX 리뷰" },
  "accessibility-check": { en: "Accessibility Check", ko: "접근성 점검" },
  "implementation-prompt": { en: "Implementation Prompt", ko: "구현 프롬프트" },
  // Frontend
  "code-architecture": { en: "Code Architecture", ko: "코드 아키텍처" },
  "component-implementation": {
    en: "Component Implementation",
    ko: "컴포넌트 구현",
  },
  "state-management": { en: "State Management", ko: "상태 관리" },
  "routing-strategy": { en: "Routing Strategy", ko: "라우팅 전략" },
  "performance-budget": { en: "Performance Budget", ko: "성능 예산" },
  "accessibility-implementation": {
    en: "Accessibility Implementation",
    ko: "접근성 구현",
  },
  // Design System
  "token-system": { en: "Token System", ko: "토큰 시스템" },
  "primitive-design": { en: "Primitive Design", ko: "프리미티브 설계" },
  "variant-system": { en: "Variant System", ko: "베리언트 체계" },
  "documentation-strategy": { en: "Documentation Strategy", ko: "문서화 전략" },
  "migration-plan": { en: "Migration Plan", ko: "마이그레이션 계획" },
  // Harness
  "harness-target-selection": {
    en: "Harness Target Selection",
    ko: "하네스 타겟 선정",
  },
  "harness-permissions": { en: "Harness Permissions", ko: "하네스 권한" },
  "harness-hooks": { en: "Harness Hooks", ko: "하네스 훅" },
  "harness-install-flow": { en: "Harness Install Flow", ko: "하네스 설치 흐름" },
};

export const QUALITY_LABELS: Record<QualityRule, Bilingual> = {
  // Universal
  "avoid-vague-language": { en: "Avoid vague language", ko: "모호한 표현 회피" },
  "avoid-unnecessary-questions": {
    en: "Avoid unnecessary questions",
    ko: "불필요한 질문 회피",
  },
  "avoid-overlong-chat-response": {
    en: "Avoid overlong chat responses",
    ko: "장황한 응답 회피",
  },
  // UX/UI
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
  // Frontend
  "fe-no-any": {
    en: "No `any` — use `unknown` and narrow",
    ko: "any 금지 — unknown 사용 후 좁히기",
  },
  "fe-compose-over-branch": {
    en: "Compose over variant branching",
    ko: "베리언트 분기 대신 합성",
  },
  "fe-test-users-not-impl": {
    en: "Test users, not implementation",
    ko: "구현이 아닌 사용자 테스트",
  },
  "fe-semantic-html-first": {
    en: "Semantic HTML before ARIA",
    ko: "ARIA 이전에 시맨틱 HTML",
  },
  "fe-perf-budget": {
    en: "Enforce performance budget",
    ko: "성능 예산 강제",
  },
  "fe-state-colocation": {
    en: "Colocate state at common ancestor",
    ko: "공통 조상에 상태 동거",
  },
  // Design System
  "ds-semantic-tokens": {
    en: "Tokens are semantic, not literal",
    ko: "토큰은 시맨틱, 리터럴 금지",
  },
  "ds-no-business-in-primitive": {
    en: "No business logic in primitives",
    ko: "프리미티브에 비즈니스 로직 금지",
  },
  "ds-variants-cap-5": {
    en: "Cap variants per primitive at 5",
    ko: "프리미티브당 베리언트 5개 상한",
  },
  "ds-states-4tuple": {
    en: "States are 4-tuple (default/hover/active/disabled)",
    ko: "상태는 4튜플 (기본·호버·액티브·비활성)",
  },
  "ds-doc-canonical-usage": {
    en: "Document one canonical usage per component",
    ko: "컴포넌트당 공식 사용 예 1개",
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
  harness: {
    label: { en: "Harness Setup", ko: "하네스 세팅" },
    shortDescription: {
      en: "Configure the agent harness — install paths, permissions, hooks, and conversion notes for Claude Code / Cursor / Codex.",
      ko: "Claude Code / Cursor / Codex 등 에이전트 하네스의 설치 경로, 권한, 훅, 변환 노트를 구성합니다.",
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
  "react-patterns": {
    label: { en: "React Patterns", ko: "React 패턴" },
    summary: {
      en: "Modern React: composition, server/client boundary, hooks discipline.",
      ko: "현대 React — 합성, 서버/클라이언트 경계, 훅 규율.",
    },
  },
  "typescript-strict": {
    label: { en: "TypeScript Strict", ko: "TypeScript 엄격" },
    summary: {
      en: "Discriminated unions, no any, types as documentation, narrow at boundaries.",
      ko: "분별 유니언, any 금지, 타입을 문서로, 경계에서 좁히기.",
    },
  },
  "testing-discipline": {
    label: { en: "Testing Discipline", ko: "테스트 규율" },
    summary: {
      en: "Test users, not implementation. Behavior-first assertions.",
      ko: "구현이 아닌 사용자 행위를 테스트 — 동작 우선 단언.",
    },
  },
  "claude-code-target": {
    label: { en: "Claude Code Target", ko: "Claude Code 타겟" },
    summary: {
      en: "Install paths, settings.json, and CLAUDE.md hook layout for Claude Code.",
      ko: "Claude Code의 설치 경로, settings.json, CLAUDE.md 훅 구조.",
    },
  },
  "cursor-target": {
    label: { en: "Cursor Target", ko: "Cursor 타겟" },
    summary: {
      en: "Rules format, .mdc conversion, and cursor.json snippet for Cursor IDE.",
      ko: "Cursor의 규칙 형식, .mdc 변환, cursor.json 스니펫.",
    },
  },
  "codex-target": {
    label: { en: "Codex CLI Target", ko: "Codex CLI 타겟" },
    summary: {
      en: "AGENTS.md layout and config.toml settings for Codex CLI.",
      ko: "Codex CLI의 AGENTS.md 구조와 config.toml 설정.",
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
  "frontend-axdd-default": {
    name: {
      en: "Frontend Implementation — AxDD Default",
      ko: "프론트엔드 구현 — AxDD 기본",
    },
    bestFor: {
      en: "Translating specs and design tokens into React + Tailwind components with TypeScript discipline.",
      ko: "명세·디자인 토큰을 TypeScript 규율을 갖춘 React + Tailwind 컴포넌트로 변환.",
    },
  },
  "design-system-axdd-default": {
    name: {
      en: "Design System Generator — AxDD Default",
      ko: "디자인 시스템 생성 — AxDD 기본",
    },
    bestFor: {
      en: "Building a complete token + primitive + variant system from a brand direction.",
      ko: "브랜드 방향성에서 토큰·프리미티브·베리언트 체계 전체를 설계.",
    },
  },
  "harness-axdd-default": {
    name: {
      en: "Harness Setup — Claude Code",
      ko: "하네스 세팅 — Claude Code",
    },
    bestFor: {
      en: "Preparing a skill package for installation into Claude Code (paths, permissions, hooks).",
      ko: "Claude Code 설치용 스킬 패키지 준비 (경로·권한·훅).",
    },
  },
  "frontend-test-first": {
    name: { en: "Test-First Frontend", ko: "테스트 우선 프론트엔드" },
    bestFor: {
      en: "Test-driven React development — tests describe behavior, components follow.",
      ko: "테스트 우선 React 개발 — 테스트로 동작을 정의하고 컴포넌트가 따라옵니다.",
    },
  },
  "frontend-server-components": {
    name: { en: "Server Components First", ko: "Server Components 우선" },
    bestFor: {
      en: "Modern React with Server Components as default; client islands only when needed.",
      ko: "Server Components 기본 + 필요할 때만 client island인 현대 React.",
    },
  },
  "ds-token-only": {
    name: { en: "Token-Only Starter", ko: "토큰 전용 스타터" },
    bestFor: {
      en: "Tokens only — color, type, spacing, radius. Skip primitives for now.",
      ko: "토큰만 — 색·타이포·간격·라디우스. 프리미티브는 다음 단계.",
    },
  },
  "ds-component-library": {
    name: { en: "Component Library Builder", ko: "컴포넌트 라이브러리 빌더" },
    bestFor: {
      en: "Full component library — tokens + primitives + variants + docs.",
      ko: "완전한 컴포넌트 라이브러리 — 토큰·프리미티브·베리언트·문서.",
    },
  },
};
